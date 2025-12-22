import Comment from "../models/comments.model.js"
import Video from "../models/video.model.js"
import mongoose from "mongoose"
export const commentVideo = async (req, res , next) => {
    try {
        const user = req.user
        const {comment} = req.body
        const v_id = req.params.id
        const commentId = req.query.commentId || null

        if (!v_id || !mongoose.Types.ObjectId.isValid(v_id)) return res.status(400).json({success:false , message:"Video Id is required or Invalid "})
        
        if (!comment) return res.status(400).json({success:false , message:"Comment is Required"})
        if (comment.length > 400) return res.status(400).json({success:false , message:"Comment Letters must be lower than 400 characters"})


          const createComment = await Comment.create({
                comment , 
                v_id , 
                parent_comment:commentId , 
                user
            })       

         if (!createComment) return res.status(400).json({success:false , message:"Creation of the Comment is down"})
          
         if (createComment.parent_comment===null){
                const video = await Video.findById(v_id)
                if (!video) return res.status(400).json({success:false  , message:"We can't find the Video"})
                
                video.comments.push(createComment.id)
                await video.save()

            return res.status(201).json({success:true , message:"Comment Created Successfully"})
         }
         if (createComment.parent_comment!=null){
            const parentComment = await Comment.findById(commentId)
            if (!parentComment) return res.status(400).json({success:false  , message:"We can't find the comment"})
            
            parentComment.replies.push(createComment.id)
            await parentComment.save()

            return res.status(201).json({success:true , message:"Reply Created Successfully"})

         }
         
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const likeComment = async (req, res , next) => {
    try {
       const commentId = req.params.id
       const clk = req.query.clk
       
      if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({success:false , message:"Comment Id is required or Invalid "})

      const comment = await Comment.findById(commentId)
      
      if (!comment) return res.status(400).json({success:false , message:"We Can't Find Comment"})
      
      if (clk==="true") comment.likes -=1
      if (clk==="false") comment.likes +=1
      
      await comment.save()
      return res.status(200).json({success:true , message:"You Liked Comment"})
     
    } catch (error) {
        return next(new Error(error.message))
    }
}

export const dislikeComment = async (req, res , next) => {
    try {
       const commentId = req.params.id
       const clk = req.query.clk
       
      if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({success:false , message:"Comment Id is required or Invalid "})

      const comment = await Comment.findById(commentId)
      
      if (!comment) return res.status(400).json({success:false , message:"We Can't Find Comment"})
      
      if (clk==="true") comment.dislikes -=1
      if (clk==="false") comment.dislikes +=1
      
      await comment.save()
      return res.status(200).json({success:true , message:"You Disliked Comment"})
     
    } catch (error) {
        return next(new Error(error.message))
    }
}

export const updateComment = async (req, res , next)=>{
    try {
        const commentId = req.params.id
        const {comment} = req.body

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({success:false , message:"Comment Id is required or Invalid "})
        
        if (!comment) return res.status(400).json({success:false , message:"Comment is Required"})

        const commentUpdated = await Comment.findByIdAndUpdate(commentId , {comment} , {new : true})
        if (!commentUpdated) return res.status(400).json({success:false , message: "We Can't Update The Comment"})
        
       
        return res.status(200).json({success:true , message: "Comment Updated Successfully"})    
    } catch (error) {
        return next(new Error(error.message))
    }
}

export const deleteComment =async (req, res , next)=>{
    try {
        const videoId = req.params.id
        const commentId = req.query.commentId?.trim();


        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({success:false , message:"Comment Id is required or Invalid "})
            
        const comments = await Comment.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(commentId) }
                },
                {
                    $graphLookup: {
                    from: "comments",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parent_comment",
                    as: "descendants"
                    }
                }
                ]);

                const ids = [
                comments[0]._id,
                ...comments[0].descendants.map(c => c._id),
                ];


            const deletedComments = await Comment.deleteMany({_id : {$in : ids}})

            if (!deleteComment) return res.status(400).json({success:false , message:"We Can't Delete The Comment"})
            
            return res.status(200).json({success:true , message: "Comment Deleted Successfully"})
        
    } catch (error) {
        return next(new Error(error.message))
    }
}

