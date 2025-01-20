import mongoose, { Document, Schema } from "mongoose";

interface Search extends Document {
    searchSuggestion: string,
}

const SearchSchema: Schema = new mongoose.Schema<Search>({
    searchSuggestion: {
        type: String,
        required: true,
    }
})

const SearchModel = mongoose.model<Search>("SearchSuggestion", SearchSchema)

export default SearchModel