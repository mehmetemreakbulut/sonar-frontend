import * as React from 'react';
import { Component } from 'react';
import AuthService from "../services/auth.service";
import CatalogService, { ArticlePage } from "../services/catalog.service"
import { useParams } from 'react-router-dom';
import { Article } from '../services/search.service';
import { ArticleIdentifier, CatalogBase } from '../services/catalog.service';
import { Pagination } from '@mui/material';
import BasicTabs from "./articleCard.component";
 
export default function CatalogPapers(){

    const { catalog_name } = useParams();
    const [catalogBase, setCatalogBase] = React.useState<ArticlePage | null>(null);
    const [catalogBaseIdentifiers, setCatalogBaseIdentifiers] = React.useState<string[]>([]);
    const [ page, setPage ] = React.useState<number>(1);
    const [catalogBaseRemoved, setCatalogBaseRemoved] = React.useState<boolean >(false);
    const [catalogBaseAdded, setCatalogBaseAdded] = React.useState<boolean >(false);
    React.useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (catalog_name===undefined){
            return
        }
        CatalogService.getCatalogBaseArticles(catalog_name, page.toString()).then(
      (response) => {
        let catalogBaseData = response.data
        setCatalogBase(catalogBaseData)
        console.log(catalogBaseData)
        setCatalogBaseIdentifiers(catalogBaseData.articles.map((article) => article.DOI))
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
      }
    );
},[])
   
    const handlePageChange = (event: any, value:number) =>{
        setPage(page)
  }
    const  handleCatalogAdded = (added:boolean, article:Article) => {
    if(added){
    setCatalogBaseAdded(true)
    setCatalogBaseRemoved(false)
    if(catalogBase===null){
        return
    }
    let catalogBaseIdentifiers = catalogBase.articles.map((article) => article.DOI)
    catalogBaseIdentifiers.push(article.DOI)
    setCatalogBaseIdentifiers(catalogBaseIdentifiers)
    console.log(catalogBaseIdentifiers)
    }
    else{
    setCatalogBaseAdded(false)
    setCatalogBaseRemoved(true)
    if(catalogBase===null){
        return
    }
    setCatalogBaseIdentifiers(catalogBaseIdentifiers.filter((identifier) => identifier !== article.DOI))
    console.log(catalogBaseIdentifiers)
    }
    

    }
    const renderArticles = () =>{
        if(catalog_name===undefined){
            return <div></div>
        }
        else{

            if (catalogBase == null) {
                return <div></div>
            } 
            return (
                
                <div>
                <Pagination count={catalogBase.page_count} page={page} onChange={handlePageChange} style={{marginTop:'20px',marginBottom:'20px'}}/>
                {catalogBase.articles.map((article) => (
                <BasicTabs article={article} key={article.DOI} handleNoCatalogBaseSelected={()=>{}} 
                currentCatalog={catalog_name} handleCatalogAdded={handleCatalogAdded} 
                catalogBaseIdentifiers={catalogBaseIdentifiers} allowUpdate={true}></BasicTabs>
            ))}
            </div>
            )
        }
    }
    return ( 
    <div>
        {renderArticles()}
    </div> );
  
}
 


