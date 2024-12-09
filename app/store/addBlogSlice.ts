import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the status types
export enum STATUS {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}

// Blog types
export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogState {
  blogs: Blog[];
  singleBlog: Blog | null;
  blogsStatus: STATUS;
  singleBlogStatus: STATUS;
  error: string | null; // For general errors
  singleBlogError: string | null; // For single blog-specific errors
}

// Initial State
const initialState: BlogState = {
  blogs: [],
  singleBlog: null,
  blogsStatus: STATUS.IDLE,
  singleBlogStatus: STATUS.IDLE,
  error: null,
  singleBlogError: null,
};

// Add Blog Data (POST)
export const sendBlog = createAsyncThunk<Blog, Partial<Blog>>(
  "blog/sendapi",
  async (blogData) => {
    const response = await axios.post(
      "http://localhost:8000/api/blog/addQuestion",
      blogData
    );
    return response.data;
  }
);

// Fetch Blog Data (GET)
export const getBlog = createAsyncThunk<Blog[]>(
  "blog/getapi",
  async () => {
    const response = await axios.get(
      "http://localhost:8000/api/blog/getquestion",
      { withCredentials: true }
    );
    console.log(response.data.data);
    return response.data.data;
  }
);

const addBlogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Blog
      .addCase(sendBlog.pending, (state) => {
        state.blogsStatus = STATUS.LOADING;
      })
      .addCase(
        sendBlog.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          state.blogsStatus = STATUS.SUCCESS;
          state.blogs.push(action.payload);
        }
      )
      .addCase(sendBlog.rejected, (state) => {
        state.blogsStatus = STATUS.FAILED;
        state.error = "Failed to add blog.";
      })

      // Fetch Blogs
      .addCase(getBlog.pending, (state) => {
        state.blogsStatus = STATUS.LOADING;
      })
      .addCase(
        getBlog.fulfilled,
        (state, action: PayloadAction<Blog[]>) => {
          state.blogsStatus = STATUS.SUCCESS;
          state.blogs = action.payload;
        }
      )
      .addCase(getBlog.rejected, (state) => {
        state.blogsStatus = STATUS.FAILED;
        state.error = "Failed to fetch blogs.";
      });
  },
});

// Selector
export const getAllBlogs = (state: { blog: BlogState }) => state.blog.blogs;

// Export reducer
export default addBlogSlice.reducer;
