import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "@/../interface";

type BookState = {
  bookItems: BookingItem[];
};

const initialState: BookState = {
  bookItems: [],
};

export const bookSlice = createSlice({
  name: "bookSlice",
  initialState,
  reducers: {

    addBooking: (state, action: PayloadAction<BookingItem>) => {
      const newBooking = action.payload;
      const index = state.bookItems.findIndex(
        (item) =>
          item.venue === newBooking.venue &&
          item.bookDate === newBooking.bookDate
      );
      if (index !== -1) {
        state.bookItems[index] = newBooking;
      } else {
        state.bookItems.push(newBooking);
      }
    },

    removeBooking: (state, action: PayloadAction<BookingItem>) => {
      const booking = action.payload;
      state.bookItems = state.bookItems.filter(
        (item) =>
          !(
            item.nameLastname === booking.nameLastname &&
            item.tel === booking.tel &&
            item.venue === booking.venue &&
            item.bookDate === booking.bookDate
          )
      );
    },

    // เพิ่มตรงนี้
    editBooking: (state, action: PayloadAction<{ original: BookingItem; updated: BookingItem }>) => {
      const { original, updated } = action.payload;
      const index = state.bookItems.findIndex(
        (item) =>
          item.nameLastname === original.nameLastname &&
          item.tel === original.tel &&
          item.venue === original.venue &&
          item.bookDate === original.bookDate
      );
      if (index !== -1) {
        state.bookItems[index] = updated;
      }
    },

  },
});

export const { addBooking, removeBooking, editBooking } = bookSlice.actions; // เพิ่ม editBooking

/* IMPORTANT */
export default bookSlice.reducer;