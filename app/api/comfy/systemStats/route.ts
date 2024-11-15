import { type NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { missingViewComfyFileError, viewComfyFileName } from '@/app/constants';
import { ErrorBase, ErrorResponseFactory, ErrorTypes } from '@/app/models/errors';
import { ComfyUIService } from '@/app/services/comfyui-service';

const errorResponseFactory = new ErrorResponseFactory();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {
  
        // Effectuer la requête vers ton API externe
        const response = await fetch('http://comfyui:8188/api/system_stats');
        if (!response.ok) {
          return NextResponse.json({ error: 'Failed to fetch system stats' });
        }
    
        const data = await response.json(); // On parse la réponse JSON
        return NextResponse.json(data);
          
    } catch (error: unknown) {
        const responseError = errorResponseFactory.getErrorResponse(error);
        return NextResponse.json(responseError, {
            status: 500,
        });
    }
    
}
