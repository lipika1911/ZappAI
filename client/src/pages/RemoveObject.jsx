import React, { useState } from 'react'
import {Scissors, Sparkles} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()
    
  const onSubmitHandler = async(e) => {
    e.preventDefault();
    try {
      setLoading(true)

      if(object.split(' ').length > 1){
        return toast.error("Please enter object in one word!")
      }

      const formData = new FormData()
      formData.append('image',input)
      formData.append('object',object)
      
      const {data} = await axios.post('/api/ai/remove-image-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      if(data.success){
        setContent(data.content)
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left part */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Object Remover</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>

        <input onChange={(e)=>setInput(e.target.files[0])} type="file" accept='image/*' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' required/>
        <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, and other image formats.</p>

        <p className='mt-6 text-sm font-medium'>Describe Object to be removed</p>

        <textarea value={object} onChange={(e)=>setObject(e.target.value)} rows={4} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='e.g., watch or spoon, Only single object name' required/>

        <button disabled={loading} type='submit' className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? (
            <>
              <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> Removing ...
            </>
          )  : (
            <>
              <Scissors className='w-5'/>
              Remove Object
            </>
          )}
        </button>
      </form>

      {/* right part */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-6 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        {
          !content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Scissors className='w-9 h-9'/>
                <p className='max-w-sm text-center'>Describe the object to be removed and click "Remove Object" to get started.</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full'>
              <img src={content} alt="image" className='w-full h-full' />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default RemoveObject


