import { getMaterials, createMaterial, editMaterial, removeMaterial, removeMultipleMaterials } from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//create an asynchron function with two parameters : the name of the action and the function called 
//No param is needed so reject if a param is insert, getMaterial from api.service is called

//Get All the Material 
export const fetchMaterials = createAsyncThunk(
  "material/fetchMaterials",

  async (_, { rejectWithValue }) => {
    try {
      return await getMaterials();
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const addMaterial = createAsyncThunk(
  "materials/addMaterial",

  async (product, { rejectWithValue }) => {
    try {
      return await createMaterial(product);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const updateMaterial = createAsyncThunk(
  "materials/updateMaterial",

  async (item, { rejectWithValue }) => {
    try {
      return await editMaterial(item);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const deleteMaterial = createAsyncThunk(
  "materials/deleteMaterial",

  async (materialId, { rejectWithValue }) => {
    try {
      return await removeMaterial(materialId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const deleteManyMaterials = createAsyncThunk(
  "materials/deleteManyMaterials",

  async (item, { rejectWithValue }) => {
    try {
      return await removeMultipleMaterials(item);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

//Manage state of materials
// reducer for synchron function , extraReducers for asynchron
const materialSlice = createSlice({
  name: "materials",
  initialState: {
    materials: [],
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    //case when action is running 
      .addCase(fetchMaterials.pending, (state) => {
        state.isLoading = true;
      })

      //case when action succeded
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        //payload is the property associeted with the action
        state.materials = action.payload;
      })
      //case when a action failed 
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload?.errorMessage;
        state.materials = [];
      })

      //## Add Material 
      .addCase(addMaterial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        //Unshift add the data contains in addMaterial.fullfilled in state.material
        //which contains the material in the database 
        state.categories.unshift(action.payload);
      })
      .addCase(addMaterial.rejected, (state, action) => {
        state.error = action.payload?.errorMessage;
      })
      //Update Material
      .addCase(updateMaterial.pending, (state) => {
        state.isLoading = true;
      })
      //find Index find the index of the material modify
      // if the index find is present in state.materials 
      // the material find in state.materials is replaced by the material 
      //with the material with the index founded 
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.materials.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.materials.splice(index, 1, action.payload);
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.error = action.payload?.errorMessage;
      })


      // Delete Material
      // Splice update state.materials
      .addCase(deleteMaterial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.materials.findIndex(m => m._id === action.payload.materialId);
        if (index !== -1) state.matreials.splice(index, 1);
        state.message = action.payload?.message
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
      })

      //Delete Many Material
      .addCase(deleteManyMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteManyMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        //Get the list return by action.payload which refers to the id selected for deleting 
        const idsList = action?.payload;
        const message = `${idsList.length} Materiaux${idsList.length > 1 ? 's' : ''} supprimé${idsList.length > 1 ? 's' : ''} avec succes`;
        state.message = message;
        //state.materials will only store the material wich is not into idsList
        state.materials = state.materials.filter(material => !idsList.includes(material._id));
      })
      .addCase(deleteManyMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
      });
  
  },
});

// export const {  } = userSlice.actions;
export default materialSlice.reducer;
