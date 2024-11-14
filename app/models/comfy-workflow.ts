import path from "node:path";
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import type { IInput } from "../interfaces/input";

const COMFY_INPUTS_DIR = path.join(process.cwd(), "comfy", "inputs");
const COMFY_WORKFLOWS_DIR = path.join(process.cwd(), "comfy", "workflows");

export class ComfyWorkflow {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private workflow: { [key: string]: any };
    private workflowFileName: string;
    private workflowFilePath: string;
    private id: string;

    constructor(workflow: object) {
        this.workflow = workflow;
        this.id = crypto.randomUUID();
        this.workflowFileName = `workflow_${this.id}.json`;
        this.workflowFilePath = path.join(COMFY_WORKFLOWS_DIR, this.workflowFileName);
    }

    public async setViewComfy(viewComfy: IInput[]) {
        for (const input of viewComfy) {
            const path = input.key.split("-");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let obj: any = this.workflow;
            for (let i = 0; i < path.length - 1; i++) {
                if (i === path.length - 1) {
                    continue;
                }
                obj = obj[path[i]];
            }
            if (input.value instanceof File) {
                const filePath = await this.createFileFromInput(input.value);
                obj[path[path.length - 1]] = filePath;
            } else {
                obj[path[path.length - 1]] = input.value;
            }
        }
        for (const key in this.workflow) {
            if (this.workflow[key].class_type === "SaveImage" || this.workflow[key].class_type === "VHS_VideoCombine") {
                this.workflow[key].inputs.filename_prefix = this.getFileNamePrefix();
            }
            console.log(this.workflow[key])
        }
    }

    public getWorkflow() {
        return this.workflow;
    }

    public getWorkflowFilePath() {
        return this.workflowFilePath;
    }

    public getWorkflowFileName() {
        return this.workflowFileName;
    }

    public getFileNamePrefix() {
        return `${this.id}_`;
    }

    private async createFileFromInput(file: File) {
        const fileName = `${this.getFileNamePrefix()}${file.name}`;
        const filePath = path.join(COMFY_INPUTS_DIR, fileName);
        const fileBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(fileBuffer));
        return filePath;
    }
}
