import React, { useRef, useEffect } from 'react';

export interface IBoundingBox {
    x: number;
    y: number;
    x2: number;
    y2: number;
}

export interface IImageWithBoundingBoxesProps {
    boundingBoxes: IBoundingBox[];
    imagePath: string;
}

const ImageWithBoundingBoxes: React.FC<IImageWithBoundingBoxesProps> = ({ boundingBoxes, imagePath }) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const findRectHandler = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const clickedBoundingBox = boundingBoxes.find((box) => {
            return mouseX >= box.x * canvas.width &&
                mouseX <= box.x2 * canvas.width &&
                mouseY >= box.y * canvas.height &&
                mouseY <= box.y2 * canvas.height;
        });

        console.log(clickedBoundingBox)
    }

    useEffect(() => {
        const image = imgRef.current
        const canvas = canvasRef.current

        const ctx = canvas.getContext('2d');

        image.onload = () => {
            console.log('Image loaded', image.width)

            // Set canvas dimensions to match image dimensions
            canvas.width = image.width
            canvas.height = image.height
        };

        console.log(boundingBoxes)

        if(boundingBoxes.length > 0) {
            // // Draw bounding boxes
            boundingBoxes.forEach((box) => {
                drawBoundingBox(ctx, box);
            });
        }
    }, [boundingBoxes, imagePath]);

    const drawBoundingBox = (context: CanvasRenderingContext2D, box: IBoundingBox) => {
        const image = imgRef.current;

        // Convert normalized coordinates to pixel coordinates
        const x = box.x * image.width;
        const y = box.y * image.height;
        const width = (box.x2 - box.x) * image.width; // Assuming x2 is the right boundary
        const height = (box.y2 - box.y) * image.height; // Assuming y2 is the bottom boundary

        // Set the style for the bounding box
        context.strokeStyle = 'red';
        context.lineWidth = 4;

        // Draw the bounding box
        context.strokeRect(x, y, width, height);
    };

    // return <div><canvas ref={imgRef} className="" /></div>

    return (<>
        <img ref={imgRef} src={imagePath} />
        <canvas ref={canvasRef} className="canvas-overlay" onClick={findRectHandler}/>
    </>)
};

export default ImageWithBoundingBoxes;
