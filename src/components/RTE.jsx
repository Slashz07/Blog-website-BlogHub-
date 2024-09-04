import {Editor} from "@tinymce/tinymce-react"
import { Controller } from 'react-hook-form'
import configEnvVar from "../configure/config"

export default function RTE({name,label,control,defaultValue=""}) {
  return (
    <div className='w-full'>
        {label ?? <label className='inline-block mb-1 pl-1'>
            {label}
            </label>}

        <Controller
        name={name || "content"}
        control={control}
        rules={{ required: "Content is required" }}
        render={({field:{onChange}})=>(
            <Editor
            apiKey={configEnvVar.tinyMceApi}
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 500,
              menubar: true,
              plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "code",
                  "help",
                  "wordcount",
                  "anchor",
              ],
              toolbar:
              "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
          }}
            onEditorChange={onChange}
            />
        )}
        
        />
    </div>
  
  )
}