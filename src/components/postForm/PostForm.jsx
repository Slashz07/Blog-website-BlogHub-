import {useCallback, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { RTE, Button, Input, Select } from "../index.js"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import appwriteService from "../../appwrite/blogDetailsStore.js"
import uploadFiles from "../../appwrite/mediaUpload.js"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function PostForm({ post }) {

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    const { register, handleSubmit, getValues, formState: { errors }, setValue, watch, control } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || ""
        }
    })

    const showError = (error) => {
        toast.error(error.message, {
            position: "top-center"
        })
    }


    const generateDateTimeId = (slug) => {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0].replace(/:/g, ''); // Getting time in HHMMSS format
        return `${time}-${slug}`;
    };


    const submit = async (data) => {
        if (post) {
            try {
                if (data.image[0] && data.image[0].size > 1024 * 1024) {
                    const error = new Error("Image size must not exceed 1mb");
                    error.status = 401;
                    throw error;
                }
                const file = data.image[0] ? await uploadFiles.uploadFile(data.image[0]) : null
                if (file) {
                    uploadFiles.deleteFile(post.featuredImage)
                }

                const dbPost = await appwriteService.updateBlog(
                    post.$id,
                    {
                        ...data,
                        featuredImage: file ? file.$id : undefined
                    }
                )

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            } catch (error) {
                showError(error)
            }

        } else {
            try {
                if (data.slug.length > 29) {
                    const error = new Error("Title slug length must not exceed 29 characters,Please provide a short and crisp title");
                    error.status = 401;
                    throw error;
                }

                if (data.image[0].size > 1024 * 1024) {
                    const error = new Error("Image size must not exceed 1mb");
                    error.status = 401;
                    throw error;
                }

                const file = data.image[0] ? await uploadFiles.uploadFile(data.image[0]) : null

                const dbPost = await appwriteService.createBlog({
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                    userId: userData.$id,
                    blogId: generateDateTimeId(data.slug)
                })
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            } catch (error) {
                showError(error)
            }

        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value == "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d]+/g, '-')
        }
        return ""

    }, [])

    useEffect(() => {
        const subsciption = watch((value, { name }) => {//watch observes the entire form fields and if any change occurs the name here will be the field's name that changed and value is the actual changed value
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true })
            }
        })
        return () => {
            subsciption.unsubscribe()
        }
    }, [watch, slugTransform, setValue])

    return (
        <>
            <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
                <div className='w-2/3 px-2'>
                    <div>
                        <Input
                            label="Title: "
                            name="title"
                            placeholder="title"
                            className="mb-4"
                            {...register("title", {
                                required: "Title is required"
                            })}
                        />
                        {errors.title && <p className="text-red-600  mb-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <Input
                            label="Slug: "
                            name="slug"
                            placeholder="slug"
                            defaultValue={getValues("slug")}
                            className="mb-4"
                            {...register("slug", {
                                required: "slug is required"
                            })}
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
                            }}
                        />
                        {errors.slug && <p className="text-red-600  mb-1">{errors.slug.message}</p>}
                    </div>

                    <RTE
                        label="Content: "
                        name="content"
                        control={control}
                        defaultValue={getValues("content")}
                        errors={errors}
                    />
                </div>
                <div className='w-1/3 px-2'>
                    <div>
                        <Input
                            label="Featured Image: "
                            type="file"
                            accept="image/jpg,image/png,image/jpeg,image/gif"
                            className="mb-4"
                            {...register("image", {
                                required: post ? false : "Image is required"
                            })}
                        />
                        {errors.image && <p className="text-red-600  mb-1">{errors.image.message}</p>}

                    </div>

                    {post && (
                        <div
                            className='w-full mb-4'
                        >
                            <img src={uploadFiles.getFilePreview(post.featuredImage)} alt={post.title}
                                className='rounded-lg'
                            />
                        </div>
                    )}

                    <div>
                        <Select
                            label="Status: "
                            name="status"
                            options={["active", "inactive"]}
                            className="mb-4"
                            {...register("status", { required: "status is required" })}
                        />
                        {errors.status && <p className="text-red-600  mb-1">{errors.status.message}</p>}
                    </div>


                    <Button
                        type="submit"
                        text={post ? "Update" : "Submit"}
                        className='w-full'
                        bg-color={post ? "bg-green-500" : undefined}
                    />

                </div>
            </form>
        </>
    )
}

export default PostForm