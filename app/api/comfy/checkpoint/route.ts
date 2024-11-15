import { type NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { missingViewComfyFileError, viewComfyFileName } from '@/app/constants';
import { ErrorBase, ErrorResponseFactory, ErrorTypes } from '@/app/models/errors';
import { ComfyUIService } from '@/app/services/comfyui-service';

const errorResponseFactory = new ErrorResponseFactory();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {

    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    let workflow  = {};
    let viewComfy = {};

    switch(type) {

        case "unet":
            workflow = {"10":{"inputs":{"clip_name1":"t5-v1_1-xxl-encoder-Q8_0.gguf","clip_name2":"clip_l.safetensors","type":"flux"},"class_type":"DualCLIPLoaderGGUF","_meta":{"title":"DualCLIPLoader (GGUF)"}},"11":{"inputs":{"unet_name":"flux1-schnell-Q8_0.gguf"},"class_type":"UnetLoaderGGUF","_meta":{"title":"Unet Loader (GGUF)"}},"14":{"inputs":{"cfg":1,"model":["11",0],"positive":["24",0],"negative":["25",0]},"class_type":"CFGGuider","_meta":{"title":"CFGGuider"}},"16":{"inputs":{"scheduler":"normal","steps":4,"denoise":1,"model":["11",0]},"class_type":"BasicScheduler","_meta":{"title":"BasicScheduler"}},"17":{"inputs":{"sampler_name":"euler"},"class_type":"KSamplerSelect","_meta":{"title":"KSamplerSelect"}},"18":{"inputs":{"width":1024,"height":1024,"batch_size":1},"class_type":"EmptyLatentImage","_meta":{"title":"Empty Latent Image"}},"19":{"inputs":{"noise":["20",0],"guider":["14",0],"sampler":["17",0],"sigmas":["16",0],"latent_image":["18",0]},"class_type":"SamplerCustomAdvanced","_meta":{"title":"SamplerCustomAdvanced"}},"20":{"inputs":{"noise_seed":50915581693241},"class_type":"RandomNoise","_meta":{"title":"RandomNoise"}},"21":{"inputs":{"samples":["19",0],"vae":["22",0]},"class_type":"VAEDecode","_meta":{"title":"VAE Decode"}},"22":{"inputs":{"vae_name":"ae.safetensors"},"class_type":"VAELoader","_meta":{"title":"Load VAE"}},"23":{"inputs":{"filename_prefix":"ComfyUI","images":["21",0]},"class_type":"SaveImage","_meta":{"title":"Save Image"}},"24":{"inputs":{"clip_l":"an apple inside a bottle","t5xxl":"an apple inside a bottle","guidance":3.5,"clip":["10",0]},"class_type":"CLIPTextEncodeFlux","_meta":{"title":"CLIPTextEncodeFlux"}},"25":{"inputs":{"clip_l":"","t5xxl":"","guidance":3.5,"clip":["10",0]},"class_type":"CLIPTextEncodeFlux","_meta":{"title":"CLIPTextEncodeFlux"}}};
            viewComfy = [{"key":"10-inputs-clip_name1","value":"t5-v1_1-xxl-encoder-Q8_0.gguf"},{"key":"10-inputs-clip_name2","value":"clip_l.safetensors"},{"key":"10-inputs-type","value":"flux"},{"key":"11-inputs-unet_name","value":"flux1-schnell-Q8_0.gguffghjgfh"},{"key":"14-inputs-cfg","value":1},{"key":"16-inputs-scheduler","value":"normal"},{"key":"16-inputs-steps","value":4},{"key":"16-inputs-denoise","value":1},{"key":"17-inputs-sampler_name","value":"euler"},{"key":"18-inputs-width","value":1024},{"key":"18-inputs-height","value":1024},{"key":"18-inputs-batch_size","value":1},{"key":"20-inputs-noise_seed","value":50915581693241},{"key":"22-inputs-vae_name","value":"ae.safetensors"},{"key":"23-inputs-filename_prefix","value":"ComfyUI"},{"key":"24-inputs-clip_l","value":"an apple inside a bottle"},{"key":"24-inputs-t5xxl","value":"an apple inside a bottle"},{"key":"24-inputs-guidance","value":3.5},{"key":"25-inputs-clip_l","value":""},{"key":"25-inputs-t5xxl","value":""},{"key":"25-inputs-guidance","value":3.5}];
            break;
            
        case "checkpoint":
        default:
            workflow = {"3":{"inputs":{"seed":93041764947522,"steps":20,"cfg":8,"sampler_name":"dpmpp_2m","scheduler":"normal","denoise":0.87,"model":["14",0],"positive":["6",0],"negative":["7",0],"latent_image":["15",0]},"class_type":"KSampler","_meta":{"title":"KSampler"}},"6":{"inputs":{"text":"photograph of victorian woman with wings, sky clouds, meadow grass\n","clip":["14",1]},"class_type":"CLIPTextEncode","_meta":{"title":"CLIP Text Encode (Prompt)"}},"7":{"inputs":{"text":"watermark, text\n","clip":["14",1]},"class_type":"CLIPTextEncode","_meta":{"title":"CLIP Text Encode (Prompt)"}},"8":{"inputs":{"samples":["3",0],"vae":["14",2]},"class_type":"VAEDecode","_meta":{"title":"VAE Decode"}},"9":{"inputs":{"filename_prefix":"ComfyUI","images":["8",0]},"class_type":"SaveImage","_meta":{"title":"Save Image"}},"14":{"inputs":{"ckpt_name":"dfhdghdgh.safetensors"},"class_type":"CheckpointLoaderSimple","_meta":{"title":"Load Checkpoint"}},"15":{"inputs":{"width":512,"height":512,"batch_size":1},"class_type":"EmptyLatentImage","_meta":{"title":"Empty Latent Image"}}};
            viewComfy = [{"key":"6-inputs-text","value":"photograph of victorian woman with wings, sky clouds, meadow grass\n"},{"key":"7-inputs-text","value":"watermark, text\n"},{"key":"3-inputs-seed","value":"randomize"},{"key":"3-inputs-steps","value":20},{"key":"3-inputs-cfg","value":8},{"key":"3-inputs-sampler_name","value":"dpmpp_2m"},{"key":"3-inputs-scheduler","value":"normal"},{"key":"3-inputs-denoise","value":0.87},{"key":"9-inputs-filename_prefix","value":"ComfyUI"},{"key":"14-inputs-ckpt_name","value":"dfgsdfg.safetensors"},{"key":"15-inputs-width","value":512},{"key":"15-inputs-height","value":512},{"key":"15-inputs-batch_size","value":1}];
            break;
    }  

    try {
        const comfyUIService = new ComfyUIService();
        const stream = await comfyUIService.runWorkflow({ workflow, viewComfy });
        console.log('success');
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const existingModels = extractModelsFromError(error);
        console.log(existingModels);
        return NextResponse.json({ checkpoints: existingModels });
    }
    
    return NextResponse.json({ error: 'failed to fetch checkpoint list' });
}

function extractModelsFromError(error: { errors: string[] }): string[] {
    const modelError = error.errors.find(err => err.includes('not in'));
    if (!modelError) {
        return [];
    }
    const match = modelError.match(/not in \[(.*?)\]/);
    if (match && match[1]) {
        return match[1].split(',').map(model => model.trim().replace(/['"]/g, ''));
    }
    return [];
}

