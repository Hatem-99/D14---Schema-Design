import express from "express";
import createHttpError from "http-errors";
import authorModel from "./model.js";





const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new authorModel(req.body);
    const { _id } = await newAuthor.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await authorModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});
authorsRouter.get("/:authorID", async (req, res, next) => {
  try {
    const author = await authorModel.findById(req.params.authorID);
    if (author) {
      res.send(author);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.authorID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
authorsRouter.put("/:authorID", async (req, res, next) => {
  try {
    const updatedauthor = await authorModel.findByIdAndUpdate(
      req.params.authorID,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedauthor) {
      res.send(updatedauthor);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.authorID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
authorsRouter.delete("/:authorID", async (req, res, next) => {
  try {
    const deletedauthor = await authorModel.findByIdAndDelete(req.params.authorID);
    if (deletedauthor) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.authorID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});



export default authorsRouter;