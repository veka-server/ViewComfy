/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useFieldArray, type UseFieldArrayRemove, type UseFieldArrayReturn, type UseFormReturn } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import type { IViewComfyBase } from "@/app/providers/view-comfy-provider";
import type { IInputField } from "@/lib/workflow-api-parser";
import { parseWorkflowApiTypeToInputHtmlType } from "@/pages/view-comfy/view-comfy-form-editor";
import { Textarea } from "@/components/ui/textarea";
import { CHECKBOX_STYLE, FORM_STYLE, TEXT_AREA_STYLE } from "@/components/styles";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Dropzone } from "../ui/dropzone";
import { ChevronsUpDown } from "lucide-react"
import { AutosizeTextarea } from "../ui/autosize-text-area"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface IInputForm extends IInputField {
    id: string;
}

export function ViewComfyForm(args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<IViewComfyBase, any, undefined>, onSubmit: (data: any) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputFieldArray: UseFieldArrayReturn<any>, advancedFieldArray: UseFieldArrayReturn<any>,
    editMode?: boolean,
    children?: React.ReactNode,
    isLoading?: boolean
}) {
    const { form, onSubmit, inputFieldArray, advancedFieldArray, editMode = false, isLoading = false } = args;
    return (<>
        <ScrollArea className="w-full h-full flex-1 rounded-md px-[5px]">
            <div className='relative flex-col items-start gap-2 flex mr-1'>
                <div id="inputs-form" className="grid w-full items-start gap-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-start gap-2">
                            {editMode && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem key="title" className="ml-0.5">
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="The name of your workflow" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    The title of your workflow.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem key="description" className="ml-0.5">
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="The description of your workflow" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    The description of your workflow.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            {!editMode && (
                                <div id="workflow-title-description">
                                    <h1 className="text-xl font-semibold">{form.getValues("title")}</h1>
                                    <p className="text-md text-muted-foreground whitespace-pre-wrap">{form.getValues("description")}</p>
                                </div>
                            )}
                            <fieldset disabled={isLoading} className="grid gap-2 rounded-lg p-1">
                                {editMode && (
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        Basic Inputs
                                    </legend>
                                )}
                                {inputFieldArray.fields.map((field, index) => {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    if (field.inputs.length > 0) {
                                        if (editMode) {
                                            return (
                                                <fieldset disabled={isLoading} key={field.id} className="grid gap-4 rounded-lg border p-4">
                                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                                        {
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-ignore
                                                            field.title
                                                        }

                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-muted-foreground"
                                                            onClick={() => inputFieldArray.remove(index)}
                                                        >
                                                            <Trash2 className="size-5" />
                                                        </Button>
                                                    </legend>
                                                    <NestedInputField form={form} nestedIndex={index} editMode={editMode} formFieldName="inputs" />
                                                </fieldset>
                                            )
                                        }

                                        return (
                                            <fieldset disabled={isLoading} key={field.id} className="grid gap-4">
                                                <NestedInputField form={form} nestedIndex={index} editMode={editMode} formFieldName="inputs" />
                                            </fieldset>
                                        )
                                    }
                                    return undefined;
                                })}
                                {!editMode && (args.children)}
                            </fieldset>
                            {advancedFieldArray.fields.length > 0 && (
                                <AdvancedInputSection advancedFieldArray={advancedFieldArray} form={form} editMode={editMode} isLoading={isLoading} />
                            )}
                            {editMode && (args.children)}
                        </form>
                    </Form>
                </div>
            </div>
        </ScrollArea >
    </>)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AdvancedInputSection(args: { advancedFieldArray: UseFieldArrayReturn<any>, form: UseFormReturn<IViewComfyBase, any, undefined>, editMode: boolean, isLoading: boolean }) {
    const { advancedFieldArray, form, editMode, isLoading } = args;
    const [isOpen, setIsOpen] = useState(editMode);
    return (<>
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-2 mb-2"
        >
            {!editMode && (<div className="flex items-center space-x-4 px-4">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="default" className="w-full">
                        Advanced Inputs
                        <ChevronsUpDown className="size-5" />
                    </Button>
                </CollapsibleTrigger>
            </div>
            )}
            <CollapsibleContent className="space-y-2">
                <fieldset className="grid gap-2 rounded-lg p-1">
                    {editMode && (
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Advanced Inputs
                        </legend>
                    )}
                    {advancedFieldArray.fields.map((advancedField, index) => (
                        <fieldset disabled={isLoading} key={advancedField.id} className="grid gap-4 rounded-lg border p-4">
                            <legend className="-ml-1 px-1 text-sm font-medium">
                                {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    advancedField.title
                                }
                                {editMode && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-muted-foreground"
                                        onClick={() => advancedFieldArray.remove(index)}
                                    >
                                        <Trash2 className="size-5" />
                                    </Button>
                                )}
                            </legend>
                            <NestedInputField form={form} nestedIndex={index} editMode={editMode} formFieldName="advancedInputs" />
                        </fieldset>
                    ))}
                </fieldset>
            </CollapsibleContent>
        </Collapsible>
    </>)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NestedInputField(args: { form: UseFormReturn<IViewComfyBase, any, undefined>, nestedIndex: number, editMode: boolean, formFieldName: string }) {
    const { form, nestedIndex, editMode, formFieldName } = args;
    const nestedFieldArray = useFieldArray({
        control: form.control,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: `${formFieldName}[${nestedIndex}].inputs`
    });
    return (
        <>
            {nestedFieldArray.fields.map((item, k) => {
                const input = item as IInputForm;
                return (
                    <FormField
                        key={input.id}
                        control={form.control}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        name={`${formFieldName}[${nestedIndex}].inputs[${k}].value`}
                        render={({ field }) => (
                            <>
                                <InputFieldToUI key={input.id} input={input} field={field} editMode={editMode} remove={nestedFieldArray.remove} index={k} />
                            </>
                        )}
                    />
                )
            })}
        </>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InputFieldToUI(args: { input: IInputForm, field: any, editMode?: boolean, remove?: UseFieldArrayRemove, index: number }) {
    const { input, field, editMode, remove, index } = args;

    if (input.valueType === "long-text") {
        return (
            <FormTextAreaInput input={input} field={field} editMode={editMode} remove={remove} index={index} />
        )
    }

    if (input.valueType === "boolean") {
        return (
            <FormCheckboxInput input={input} field={field} editMode={editMode} remove={remove} index={index} />
        )
    }

    if (input.valueType === "video" || input.valueType === "image") {
        return (
            <FormMediaInput input={input} field={field} editMode={editMode} remove={remove} index={index} />
        )
    }
    
    if (input.valueType === "seed" ) {
        return (
            <FormSeedInput input={input} field={field} editMode={editMode} remove={remove} index={index} />
        )
    }

    return (
        <FormBasicInput input={input} field={field} editMode={editMode} remove={remove} index={index} />
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormSeedInput(args: { input: IInputForm, field: any, editMode?: boolean, remove?: UseFieldArrayRemove, index: number }) {
    const { input, field, editMode, remove, index } = args;

    const [isRandomized, setIsRandomized] = useState(false); // State to manage checkbox behavior
    const [storedValue, setStoredValue] = useState(field.value); // State to preserve input value

    const toggleRandomize = () => {
        const newValue = !isRandomized;
        setIsRandomized(newValue);
        if (newValue) {
            // Save the current input value before disabling it
            setStoredValue(field.value);
            field.onChange("randomize");
        } else {
            // Restore the saved value when reactivating the input
            field.onChange(storedValue);
        }
    };

    return (
        <FormItem key={input.id}>
            <FormLabel className={FORM_STYLE.label}>
                {input.title}
                {editMode && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={remove ? () => remove(index) : undefined}
                    >
                        <Trash2 className="size-5" />
                    </Button>
                )}
            </FormLabel>
            <FormControl>
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder={input.placeholder}
                        {...field}
                        type="number"
                        disabled={isRandomized} // Disable input if checkbox is checked
                        value={isRandomized ? "randomize" : field.value} // Display "randomize" if checkbox is checked
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isRandomized) {
                                setStoredValue(value); // Update stored value when input changes
                                field.onChange(value);
                            }
                        }}
                        className="flex-1"
                    />
                    {/* Hidden checkbox */}
                    <Checkbox
                        className="hidden"
                        checked={isRandomized}
                        onCheckedChange={() => {}}
                    />
                    {/* Randomize button */}
                    <button
                        type="button"
                        title={isRandomized ? "Disable randomization" : "Enable randomization"}
                        onClick={toggleRandomize}
                        className={`p-2 rounded-md ${
                            isRandomized ? "text-blue-500" : "text-gray-400"
                        } hover:text-blue-600`}
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </FormControl>
            {input.helpText !== "Helper Text" && (
                <FormDescription>
                    {input.helpText}
                </FormDescription>
            )}
        </FormItem>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormMediaInput(args: { input: IInputForm, field: any, editMode?: boolean, remove?: UseFieldArrayRemove, index: number }) {
    const { input, field, editMode, remove, index } = args;
    const [media, setMedia] = useState({
        src: "",
        name: "",
    });

    let fileExtensions: string[] = []
    if (input.valueType === "image") {
        fileExtensions = ['png', 'jpg', 'jpeg']
    } else if (input.valueType === "video") {
        fileExtensions = ['mp4', 'avi', 'webm', 'mkv', 'gif']
    }

    useEffect(() => {
        if (field.value && field.value instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const name = field.value.name
                    setMedia({
                        src: content,
                        name: name
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    setMedia({
                        src: "",
                        name: ""
                    });
                }
            };
            reader.readAsDataURL(field.value);
        }
    }, [field.value]);

    const onDelete = () => {
        field.onChange(null);
        setMedia({
            src: "",
            name: ""
        });
    }

    return (
        <FormItem key={input.id}>
            <FormLabel className={FORM_STYLE.label}>{input.title}
                {editMode && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={remove ? () => remove(index) : undefined}
                    >
                        <Trash2 className="size-5" />
                    </Button>
                )}
            </FormLabel>
            <FormControl>
                {media.src ? (
                    <div key={input.id} className="flex flex-col items-center gap-2">
                        <div className="max-w-full h-48 flex items-center justify-center overflow-hidden border rounded-md">
                            {(input.valueType === "image") && (
                                <img
                                    src={media.src}
                                    alt={media.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            )}
                            {(input.valueType === "video") && (
                                <video
                                    className="max-w-full max-h-full object-contain"
                                    autoPlay
                                    loop

                                >
                                    <track default kind="captions" srcLang="en" src="" />
                                    <source src={media.src} />
                                </video>
                            )}
                        </div>
                        <Button
                            variant="secondary"
                            className="border-2 text-muted-foreground"
                            onClick={onDelete}
                        >
                            <Trash2 className="size-5 mr-2" /> Remove {input.valueType}
                        </Button>
                    </div>
                ) : (
                    <Dropzone
                        key={input.id}
                        onChange={field.onChange}
                        fileExtensions={fileExtensions}
                        className="form-dropzone"
                        inputPlaceholder={field.value?.name}
                    />
                )}
            </FormControl>
        </FormItem>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormTextAreaInput(args: { input: IInputForm, field: any, editMode?: boolean, remove?: UseFieldArrayRemove, index: number }) {
    const { input, field, editMode, remove, index } = args;

    return (
        <FormItem key={input.id}>
            <FormLabel className={FORM_STYLE.label}>{input.title}
                {editMode && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={remove ? () => remove(index) : undefined}
                    >
                        <Trash2 className="size-5" />
                    </Button>
                )}
            </FormLabel>
            <FormControl>
                <AutosizeTextarea
                    placeholder={input.placeholder}
                    className={TEXT_AREA_STYLE}
                    {...field}
                />
            </FormControl>
            {(input.helpText !== "Helper Text") && (
                <FormDescription>
                    {input.helpText}
                </FormDescription>
            )}
        </FormItem>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormCheckboxInput(args: { input: IInputForm, field: any, editMode?: boolean, remove?: UseFieldArrayRemove, index: number }) {
    const { input, field, editMode, remove, index } = args;
    return (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0" key={input.id}>
            <FormControl>
                <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            </FormControl>
            <div className="grid gap-1.5 leading-none">
                <FormLabel className={CHECKBOX_STYLE.checkBoxLabel}>
                    {input.title}
                </FormLabel>
                {/* <FormDescription className="text-sm text-muted-foreground">
                    {input.helpText}
                </FormDescription> */}
            </div>
            {editMode && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground self-center"
                    onClick={remove ? () => remove(index) : undefined}
                >
                    <Trash2 className="size-5" />
                </Button>
            )}
        </FormItem>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormBasicInput(args: { input: IInputForm, field: any, editMode?: boolean, remove?: UseFieldArrayRemove, index: number }) {
    const { input, field, editMode, remove, index } = args;
    return (
        <FormItem key={input.id}>
            <FormLabel>{input.title}
                {editMode && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={remove ? () => remove(index) : undefined}
                    >
                        <Trash2 className="size-5" />
                    </Button>
                )}
            </FormLabel>
            <FormControl>
                <Input placeholder={input.placeholder} {...field} type={parseWorkflowApiTypeToInputHtmlType(input.valueType)} />
            </FormControl>
            {(input.helpText !== "Helper Text") && (
                <FormDescription>
                    {input.helpText}
                </FormDescription>
            )}
        </FormItem>
    )
}
