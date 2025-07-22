import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createEstimation,
  estimationList,
  getEstimationDetailsById,
  updateEstimation,
  getEstimationDetailsByNo,
  getEstimationApprovalList,
  approveEstimation,
  estimationDetailsPrint,
} from "../thunks/estimation";

export const estReducerInitialState = {
  estimationList: [],
  estimationApprovalList: [],
  estimationDetails: {},
  isError: null,
  isLoading: false,
};

export const estReducer = createSlice({
  name: "estReducer",
  initialState: estReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createEstimation.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(estimationDetailsPrint.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getEstimationDetailsByNo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.estimationDetails = action.payload;
    });

    builder.addCase(updateEstimation.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(estimationList.fulfilled, (state, action) => {
      state.estimationList = action.payload;
      state.isLoading = false;
      state.isError = false;
    });

    builder.addCase(getEstimationApprovalList.fulfilled, (state, action) => {
      state.estimationApprovalList = action.payload;
      state.isLoading = false;
      state.isError = false;
    });

    builder.addCase(getEstimationDetailsById.fulfilled, (state, action) => {
      state.estimationDetails = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        createEstimation.pending,
        updateEstimation.pending,
        estimationList.pending,
        getEstimationDetailsById.pending,
        getEstimationDetailsByNo.pending,
        getEstimationApprovalList.pending,
        approveEstimation.pending,
        estimationDetailsPrint.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createEstimation.rejected,
        updateEstimation.rejected,
        estimationList.rejected,
        getEstimationDetailsById.rejected,
        getEstimationDetailsByNo.rejected,
        getEstimationApprovalList.rejected,
        approveEstimation.rejected,
        estimationDetailsPrint.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createEstimation.fulfilled,
        updateEstimation.fulfilled,
        estimationList.fulfilled,
        approveEstimation.fulfilled,
        estimationDetailsPrint.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
        state.estimationDetails = {};
      }
    );
  },
});
