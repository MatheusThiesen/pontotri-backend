import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import canvas from "canvas";
import * as faceapi from "face-api.js";
import fs from "fs";
import path from "path";

const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({
  Canvas: Canvas as any,
  Image: Image as any,
  ImageData: ImageData as any,
});

interface CompareImagesUseCaseRequest {
  profileImage: string;
  checkInImage: string;
}

type CompareImagesUseCaseResponse = Either<
  Error,
  {
    isMatch: boolean;
  }
>;

@Injectable()
export class CompareImagesUseCase {
  async execute({
    profileImage,
    checkInImage,
  }: CompareImagesUseCaseRequest): Promise<CompareImagesUseCaseResponse> {
    try {
      await this.loadModels();

      const profileImg = await this.loadImage(profileImage);
      const checkInImg = await this.loadImage(checkInImage);

      const profileDetection = await faceapi
        .detectSingleFace(
          profileImg as any,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 416 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      const checkInDetection = await faceapi
        .detectSingleFace(
          checkInImg as any,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 416 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!profileDetection || !checkInDetection) {
        return left(
          new Error("Não foi possível detectar rosto em uma das imagens")
        );
      }

      const distance = faceapi.euclideanDistance(
        profileDetection.descriptor,
        checkInDetection.descriptor
      );

      const threshold = 0.5;
      console.log("Distância:", distance);

      return right({
        isMatch: distance < threshold,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error("Erro ao comparar imagens: " + error.message));
      }
      return left(new Error("Erro desconhecido ao comparar imagens"));
    }
  }

  async loadModels() {
    const modelPath = path.join(process.cwd(), "models");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    // await faceapi.nets.mtcnn.loadFromDisk(modelPath);
    await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  }

  async loadImage(imagePath: string) {
    const img = await canvas.loadImage(imagePath);
    return img;
  }
  async debugFaceDetection(inputImagePath: string, outputImagePath: string) {
    const img = await canvas.loadImage(inputImagePath);
    const c = canvas.createCanvas(img.width, img.height) as any;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const detections = await faceapi
      .detectAllFaces(
        img as any,
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
      )
      .withFaceLandmarks();

    if (!detections.length) {
      console.warn(`⚠️ Nenhuma face detectada em: ${inputImagePath}`);
      return;
    }

    faceapi.draw.drawDetections(
      c,
      detections.map((d) => d.detection)
    );
    faceapi.draw.drawFaceLandmarks(c, detections);

    // cria pasta se não existir
    const dir = path.dirname(outputImagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const out = fs.createWriteStream(outputImagePath);
    const stream = c.createJPEGStream({ quality: 0.95 });
    stream.pipe(out);
    out.on("finish", () => {
      console.log(`🖼️ Imagem de debug salva: ${outputImagePath}`);
    });
  }
}
