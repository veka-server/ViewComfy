import { type NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { missingViewComfyFileError, viewComfyFileName } from '@/app/constants';
import { ErrorBase, ErrorResponseFactory, ErrorTypes } from '@/app/models/errors';

const errorResponseFactory = new ErrorResponseFactory();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {

console.log('new page')
      
        return NextResponse.json({ value: 'hello world' });
    } catch (error) {
        console.error("Files not found");
        console.error(error);

        const missingFiles: string[] = [];
        if (!await fileExists(viewComfyPath)) {
            missingFiles.push(missingViewComfyFileError);
        }

        const err = new ErrorBase({
            message: "ViewMode is missing files",
            errorType: ErrorTypes.VIEW_MODE_MISSING_FILES,
            errors: missingFiles
        });

        const responseError = errorResponseFactory.getErrorResponse(err);
        return NextResponse.json(responseError, {
            status: 500,
        });
    }
}
