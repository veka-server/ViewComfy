import { type NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { missingViewComfyFileError, viewComfyFileName } from '@/app/constants';
import { ErrorBase, ErrorResponseFactory, ErrorTypes } from '@/app/models/errors';
import { ComfyUIService } from '@/app/services/comfyui-service';

const errorResponseFactory = new ErrorResponseFactory();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {

    let workflow = {"3":{"inputs":{"seed":93041764947522,"steps":20,"cfg":8,"sampler_name":"dpmpp_2m","scheduler":"normal","denoise":0.87,"model":["14",0],"positive":["6",0],"negative":["7",0],"latent_image":["15",0]},"class_type":"KSampler","_meta":{"title":"KSampler"}},"6":{"inputs":{"text":"photograph of victorian woman with wings, sky clouds, meadow grass\n","clip":["14",1]},"class_type":"CLIPTextEncode","_meta":{"title":"CLIP Text Encode (Prompt)"}},"7":{"inputs":{"text":"watermark, text\n","clip":["14",1]},"class_type":"CLIPTextEncode","_meta":{"title":"CLIP Text Encode (Prompt)"}},"8":{"inputs":{"samples":["3",0],"vae":["14",2]},"class_type":"VAEDecode","_meta":{"title":"VAE Decode"}},"9":{"inputs":{"filename_prefix":"ComfyUI","images":["8",0]},"class_type":"SaveImage","_meta":{"title":"Save Image"}},"14":{"inputs":{"ckpt_name":"dfhdghdgh.safetensors"},"class_type":"CheckpointLoaderSimple","_meta":{"title":"Load Checkpoint"}},"15":{"inputs":{"width":512,"height":512,"batch_size":1},"class_type":"EmptyLatentImage","_meta":{"title":"Empty Latent Image"}}};
    let viewComfy = [{"key":"6-inputs-text","value":"photograph of victorian woman with wings, sky clouds, meadow grass\n"},{"key":"7-inputs-text","value":"watermark, text\n"},{"key":"3-inputs-seed","value":"randomize"},{"key":"3-inputs-steps","value":20},{"key":"3-inputs-cfg","value":8},{"key":"3-inputs-sampler_name","value":"dpmpp_2m"},{"key":"3-inputs-scheduler","value":"normal"},{"key":"3-inputs-denoise","value":0.87},{"key":"9-inputs-filename_prefix","value":"ComfyUI"},{"key":"14-inputs-ckpt_name","value":"dfgsdfg.safetensors"},{"key":"15-inputs-width","value":512},{"key":"15-inputs-height","value":512},{"key":"15-inputs-batch_size","value":1}];
        

    try {
        const comfyUIService = new ComfyUIService();
        const stream = await comfyUIService.runWorkflow({ workflow, viewComfy });
        console.log('success');
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const existingModels = extractModels(errorMessage);
        console.log(existingModels);
        return NextResponse.json({ checkpoints: existingModels });
    }
    
    return NextResponse.json({ error: 'failed to fetch checkpoint list' });
}


// Fonction pour extraire la liste des modèles existants
function extractModels(input: string): string[] {
    const match = input.match(/not in \[(.*?)\]/); // Cherche la liste dans "not in [ ... ]"
    if (match && match[1]) {
        // Séparer les modèles par la virgule et nettoyer les guillemets et espaces
        return match[1].split(',').map(model => model.trim().replace(/['"]/g, ''));
    }
    return []; // Retourne une liste vide si rien n'est trouvé
}

