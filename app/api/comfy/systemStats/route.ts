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
          return res.status(response.status).json({ error: 'Failed to fetch system stats' });
        }
    
        const data = await response.json(); // On parse la réponse JSON
        res.status(200).json(data); // On renvoie les données au client
          
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération des statistiques du système:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
    
}
