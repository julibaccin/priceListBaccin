import axios from "axios";
import { IProduct } from "../App";

let urlBack = "http://localhost:4000/api";

const getProducts = async () => {
	const response = await axios.get<{ data: IProduct[] | null; error: boolean; msg: string }>(urlBack + "/products");
	return response.data;
};

const postProducts = async (file: File) => {
	let formData = new FormData();
	formData.append("excel", file);
	const response = await axios.post(urlBack + "/products", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

export { getProducts, postProducts };
