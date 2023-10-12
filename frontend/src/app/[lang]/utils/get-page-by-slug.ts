import { fetchAPI } from "@/app/[lang]/utils/fetch-api";

export async function getPageBySlug(slug: string, lang: string) {
    const path = `/pages`;
    const urlParamsObject = { filters: { slug }, locale: lang };
    return await fetchAPI(path, urlParamsObject);
}