import{get,post,put} from "../../../ProjectCommon/api/httpService";


export async function createProduct(payload: any) {
    const suffix = `/api/Product`;
    const response = await post(suffix, payload); // Pass the payload here
    console.log("Product creation response:", response);
    return response;
}

export async function updateProduct(id: string | number, payload: any) {
    const suffix = `/api/Product/${id}`;
    const response = await put(suffix, payload);
    console.log("Product update response:", response);
    return response;
}

export async function DeleteProduct(id: string | number) {
    const suffix=`/api/Product/DeleteProduct/${id}`
    const response = await put(suffix, {});
    console.log("Product delete response:", response);
    return response;
}

export async function getProducts() {
    const suffix = `/api/Product`;
    const response = await get(suffix);
    console.log("Products fetch response:", response);
    return response;
}

export async function getProductById(id: number|string) {  // Added id parameter
    const suffix = `api/Product/${id}`;
    const response = await get(suffix);
    console.log("getProductById:", response);
    return response;
}


export async function getCategories() {
    const suffix = `/api/Product/GetCategories`;
    const response = await get(suffix);
    console.log("Products Category response:", response);
    return response;
    
}
export async function creatOrder(payload: any) {
    const suffix = `/api/Order`;
    const response = await post(suffix, payload); // Pass the payload here
    console.log("Order creation response:", response);
    return response;
}


export async function getAllOders() {
    const suffix = `/api/Order/GetAllOders`;
    const response = await get(suffix);
    console.log("Products Oder response:", response);
    return response;
    
}

export async function updateStatusOrder(payload: any) {
    const suffix = `/api/Order`;
    const response = await put(suffix, payload); // Pass the payload here
    console.log("Product Status Update response:", response);
    return response;
}
