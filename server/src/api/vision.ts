import { ImageAnnotatorClient } from '@google-cloud/vision'
import { google } from '@google-cloud/vision/build/protos/protos';

export async function detectObjectsInImage(fileBuffer: Buffer) {
    // Instantiates a client
    const client = new ImageAnnotatorClient({ projectId: "894356416886" });
    const projectId = await client.getProjectId()
    const request = {
        image: { content: fileBuffer }, // Provide your image content here
        features: [{ type: 'OBJECT_LOCALIZATION' }],
        imageContext: {
            // Adjust the scoreThreshold as needed (e.g., set it to 0.7 for 70% confidence)
            objectLocalizationParams: { scoreThreshold: 0.9 },
        },
    };
    const objectLocalizations: [google.cloud.vision.v1.IAnnotateImageResponse] = await client.objectLocalization(fileBuffer)
    const boundingBoxes = objectLocalizations[0].localizedObjectAnnotations.map((loa: google.cloud.vision.v1.ILocalizedObjectAnnotation) => loa.boundingPoly.normalizedVertices)
    const resp: any = {
        boundingBoxes
    }

    // Performs label detection on the image file
    return resp
}


