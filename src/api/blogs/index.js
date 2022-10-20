import express from "express";
import createHttpError from "http-errors";
import blogModel from "./model.js";



const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res, next) => {
  try {
  

    const newblog = new blogModel(req.body);
    const { _id } = await newblog.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await blogModel.find().populate({
      path: "authors",
      select: "firstName lastName",
    });
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});
blogsRouter.get("/:blogID", async (req, res, next) => {
  try {
    const blog = await blogModel.findById(req.params.blogID).populate({
      path: "authors",
      select: "firstName lastName",
    });
    if (blog) {
      res.send(blog);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.blogID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
blogsRouter.put("/:blogID", async (req, res, next) => {
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.blogID,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: "authors",
      select: "firstName lastName",
    });
    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.blogID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
blogsRouter.delete("/:blogID", async (req, res, next) => {
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(req.params.blogID);
    if (deletedBlog) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.blogID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:blogId/comments", async (req, res, next) => {
  try {
    let blogPost = await blogModel.findById(req.params.blogId);

    if (blogPost) {
      const comment = req.body;

      const commentToInsert = {
        ...comment,
      };

      const updatedBlog = await blogModel.findByIdAndUpdate(
        req.params.blogId,
        { $push: { comments: commentToInsert } },
        { new: true, runValidators: true }
      );
      if (updatedBlog) {
        res.send(updatedBlog);
      } else {
        next(
          createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
        );
      }
    } else {
      next(
        createHttpError(404, `comment with id ${req.body.commentId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blog = await blogModel.findById(req.params.blogId);
    if (blog) {
      res.send(blog.comments);
    } else {
      next(
        createHttpError(404, `blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await blogModel.findById(req.params.blogId);
    if (blog) {
      const comments = blog.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      );

      if (comments) {
        res.send(comments);
      } else {
        next(
          createHttpError(
            404,
            `comments with id ${req.body.commentId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await blogModel.findById(req.params.blogId);

    if (blog) {
      const index = blog.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );

      if (index !== -1) {
        blog.comments[index] = {
          ...blog.comments[index],
          ...req.body,
        };

        await blog.save();
        res.send(blog);
      } else {
        next(
          createHttpError(
            404,
            `comment with id ${req.body.commentId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    console.log("this", error);
    next(error);
  }
});

blogsRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.blogId,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );
    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
