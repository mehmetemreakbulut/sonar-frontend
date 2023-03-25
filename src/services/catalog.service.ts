
import axios from 'axios';
import authHeader from './authHeader';
import { Article, Author } from './search.service';

const API_URL = 'http://localhost:8000/catalog/';

type Owner = {
    email:string
    id:string
    username:string
}

export type ArticleIdentifier = {
    DOI: string
}
export type CatalogBase = {
    catalog_name:string
    article_identifiers:  Article[]
    owner: Owner
}

export type CatalogBaseForList = {
    catalog_base_name:string
    article_count: number
}

export type CatalogExtension = {
    catalog_extension_name: string
    catalog_base:CatalogBase
    article_identifiers:  Article[]
}

export type AuthorPage = {
    authors : Author[]
    total_count : number
    page_count : number
}




export type ArticlePage = {
    articles : Article[]
    total_count : number
    page_count : number
}

export type CatalogBaseListEntity = {
    catalog_name:string
    article_count: number
}
class CatalogService {
    
    getCatalogBase(catalog_name: string){
        
        return axios.get<string[]>(API_URL + 'base/?catalog_base_name='+catalog_name, { headers: authHeader() })
    }
    getCatalogExtension(catalog_name: string, catalog_extension_id:string){
        return axios.get<string[]>(API_URL + 'extension/?catalog_name='+catalog_name+'&catalog_extension_name='+catalog_extension_id, { headers: authHeader() })
    }
    
    getCatalogBaseArticles(catalog_name: string,  offset:string){
        return axios.get<ArticlePage>(API_URL + 'base/articles/?catalog_base_name='+catalog_name+'&offset='+offset, { headers: authHeader() })
    }

    getCatalogExtensionArticles(catalog_name: string, catalog_extension_id:string, offset:string){
        return axios.get<ArticlePage>(API_URL + 'extension/articles/?catalog_base_name='+catalog_name+'&catalog_extension_name='+catalog_extension_id+'&offset='+offset, { headers: authHeader() })
    }
    createCatalogBase(catalog_name: string) {
    var bodyFormData = new FormData();
    bodyFormData.append('catalog_base_name', catalog_name);
    return axios.post(API_URL + 'base/',bodyFormData, { headers: authHeader() });
    }

    createCatalogExtension(catalog_name: string, catalog_extension_name:string) {
    var bodyFormData = new FormData();
    bodyFormData.append('catalog_base_name', catalog_name);
    bodyFormData.append('catalog_extension_name', catalog_extension_name);
    return axios.post(API_URL + 'extension/',bodyFormData, { headers: authHeader() });
    }

    getAllCatalogBases() {
        console.log(authHeader())
        return axios.get<CatalogBaseForList[]>(API_URL + 'base/all/', { headers: authHeader() });
    }

    getCatalogExtensions(catalog_name: string) {
        return axios.get<string[]>(API_URL + 'extension/all/?catalog_base_name='+catalog_name, { headers: authHeader() });
    }

    getCatalogExtensionNames(catalog_name: string) {
        return axios.get<string[]>(API_URL + 'extension/names/?catalog_base_name='+catalog_name, { headers: authHeader() });
    }

    addPaperDOIToBase(catalog_name: string,article: Article) {
        
        const data = {
            catalog_base_name: catalog_name,
            edit_type: "add_article",
            article_doi: article.DOI,

        }
        return axios.put(API_URL + 'base/', data, { headers: authHeader() });
    }

    removePaperDOIFromBase(catalog_name: string, paper_doi: string) {
        
        const data = {
            catalog_base_name: catalog_name,
            edit_type: "remove_article",
            article_doi: paper_doi
        }
        return axios.put(API_URL + 'base/', data, { headers: authHeader() });
    }

    addPaperDOIToExtension(catalog_name: string,catalog_extension_name:string, article: Article) {
        console.log("aaa")
        const data = {
            catalog_name: catalog_name,
            catalog_extension_name:catalog_extension_name,
            edit_type: "add_s2ag_paper_id",
            article_doi: article.DOI,
        }
        return axios.put(API_URL + 'extension/', data, { headers: authHeader() });
    }

    removePaperDOIFromExtension(catalog_name: string, catalog_extension_name:string, paper_doi?: string) {
        
        const data = {
            catalog_name: catalog_name,
            catalog_extension_name:catalog_extension_name,
            edit_type: "remove_s2ag_paper_id",
            paper_doi: paper_doi
        }
        return axios.put(API_URL + 'extension/', data, { headers: authHeader() });
    }

    addInbound(catalog_name: string, catalog_extension_name:string) {
        
        const data = {
            catalog_base_name: catalog_name,
            catalog_extension_name:catalog_extension_name,
            edit_type: "add_inbound_s2ag_citations",
        }
        return axios.put(API_URL + 'extension/', data, { headers: authHeader() });
    }

    addOutbound(catalog_name: string, catalog_extension_name:string) {
        console.log("hee")
        const data = {
            catalog_base_name: catalog_name,
            catalog_extension_name:catalog_extension_name,
            edit_type: "add_outbound_s2ag_citations",
        }
        return axios.put(API_URL + 'extension/', data, { headers: authHeader() });
    }
}

export default new CatalogService();