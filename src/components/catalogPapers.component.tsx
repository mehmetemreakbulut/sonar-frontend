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
    const [ page, setPage ] = React.useState<number>(1);

    React.useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (catalog_name===undefined){
            return
        }
        CatalogService.getCatalogBaseArticles(catalog_name, page.toString()).then(
      (response) => {
        let catalogBaseData = response.data
        setCatalogBase(catalogBaseData)
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
                currentCatalog={catalog_name} handleCatalogAdded={()=>{}} 
                catalogBaseIdentifiers={catalogBase.articles.map(v => v.DOI)} allowUpdate={true}></BasicTabs>
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
 


