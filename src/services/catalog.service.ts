import { SwapVerticalCircle } from '@mui/icons-material';
import { StepIconClassKey } from '@mui/material';
import axios from 'axios';
import authHeader from './authHeader';
import { Article } from './search.service';

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

export type CatalogExtension = {
    catalog_extension_name: string
    catalog_base:CatalogBase
    article_identifiers:  Article[]
}

class CatalogService {
    
    getCatalogBase(catalog_name: string){
        return axios.get<CatalogBase>(API_URL + 'base/?catalog_name='+catalog_name, { headers: authHeader() })
    }
    getCatalogExtension(catalog_name: string, catalog_extension_id:string){
        return axios.get<CatalogExtension>(API_URL + 'extension/?catalog_name='+catalog_name+'&catalog_extension_name='+catalog_extension_id, { headers: authHeader() })
    }
    createCatalogBase(catalog_name: string) {
    var bodyFormData = new FormData();
    bodyFormData.append('catalog_name', catalog_name);
    return axios.post(API_URL + 'base/',bodyFormData, { headers: authHeader() });
    }

    createCatalogExtension(catalog_name: string, catalog_extension_name:string) {
    return axios.post(API_URL + 'extension/',{catalog_name, catalog_extension_name}, { headers: authHeader() });
    }

    getAllCatalogBases() {
        return axios.get<CatalogBase[]>(API_URL + 'base/all/', { headers: authHeader() });
    }

    getCatalogExtensions(catalog_name: string) {
        return axios.get<CatalogExtension[]>(API_URL + 'extension/all/?catalog_name='+catalog_name, { headers: authHeader() });
    }

    addPaperDOIToBase(catalog_name: string,article: Article) {
        
        const data = {
            catalog_name: catalog_name,
            edit_type: "add_paper_doi",
            paper_doi: article.DOI,
            title: article.title,
            abstract: article.abstract,
            year: article.year,
            citation_count: article.citation_count,
            reference_count: article.reference_count,
            fields_of_study: article.fields_of_study,
            publication_types: article.publication_types,
            publication_date: article.publication_date,
            authors: article.authors

        }
        return axios.put(API_URL + 'base/', data, { headers: authHeader() });
    }

    removePaperDOIFromBase(catalog_name: string, paper_doi: string) {
        
        const data = {
            catalog_name: catalog_name,
            edit_type: "remove_paper_doi",
            paper_doi: paper_doi
        }
        return axios.put(API_URL + 'base/', data, { headers: authHeader() });
    }

    addPaperDOIToExtension(catalog_name: string,catalog_extension_name:string, article: Article) {
    
        const data = {
            catalog_name: catalog_name,
            catalog_extension_name:catalog_extension_name,
            edit_type: "add_s2ag_paper_id",
            paper_doi: article.DOI,
            title: article.title,
            abstract: article.abstract,
            year: article.year,
            citation_count: article.citation_count,
            reference_count: article.reference_count,
            fields_of_study: article.fields_of_study,
            publication_types: article.publication_types,
            publication_date: article.publication_date,
            authors: article.authors

        }
        return axios.put(API_URL + 'extension/', data, { headers: authHeader() });
    }

    removePaperDOIFromExtension(catalog_name: string, catalog_extension_name:string, paper_doi: string) {
        
        const data = {
            catalog_name: catalog_name,
            catalog_extension_name:catalog_extension_name,
            edit_type: "remove_paper_doi",
            paper_doi: paper_doi
        }
        return axios.put(API_URL + 'extension/', data, { headers: authHeader() });
    }

    addInbound(catalog_name: string, catalog_extension_name:string) {
        
        const data = {
            catalog_name: catalog_name,
            catalog_extension_name:catalog_extension_name,
            edit_type: "add_inbound_s2ag_citations",
        }
        return axios.put(API_URL + 'extension/', data, { headers: authHeader() });
    }

    addOutbound(catalog_name: string, catalog_extension_name:string) {
        console.log("hee")
        const data = {
            catalog_name: catalog_name,
            catalog_extension_name:catalog_extension_name,
            edit_type: "add_outbound_s2ag_citations",
        }
        return axios.put(API_URL + 'extension/', data, { headers: authHeader() });
    }
}

export default new CatalogService();