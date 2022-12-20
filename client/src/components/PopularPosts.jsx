import React from "react"
import { Link } from "react-router-dom"

export const PopularPosts = ({ post }) => {
    return (
        <div className='bg-gray-600 my-1 rounded-xl hover:bg-gray-500'>
            <Link
                to={`${post._id}`}
                className='flex text-xs p-2 text-gray-300 hover:bg-gray-600 rounded-xl hover:text-white'
            >
                {post.title}
            </Link>
        </div>
    )
}
