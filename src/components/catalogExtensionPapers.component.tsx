import * as React from 'react';
import { Component } from 'react';
import AuthService from "../services/auth.service";
import CatalogService, { ArticlePage, CatalogExtension } from "../services/catalog.service"
import { useParams } from 'react-router-dom';
import { Article } from '../services/search.service';
import { ArticleIdentifier, CatalogBase } from '../services/catalog.service';
import { Alert, Pagination, Snackbar } from '@mui/material';
import BasicTabs from "./articleCard.component";
import ExtensionCard from './extensionCardComponent';
 
export default function CatalogExtensionPapers(){

    const { catalog_name , catalog_extension_name} = useParams();
    const [catalogExtension, setCatalogExtension] = React.useState<ArticlePage | null>(null);
    const [catalogExtensionAdded, setcatalogExtensionAdded] = React.useState<boolean >(false);
    const [catalogExtensionRemoved, setcatalogExtensionRemoved] = React.useState<boolean >(false);
    const [ page, setPage ] = React.useState<number>(1);

    React.useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (catalog_name===undefined){
            return
        }
        if (catalog_extension_name===undefined){
            return
        }
        CatalogService.getCatalogExtensionArticles(catalog_name,catalog_extension_name, page.toString()).then(
      (response) => {
        let catalogExtensionData = response.data
        setCatalogExtension(catalogExtensionData)
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
},[page])
   
    const handlePageChange = (event: any, value:number) =>{
        setPage(value)
        console.log(page)
      
  }
    
  const handleCatalogAdded = (added:boolean) => {
    if(added){
    setcatalogExtensionRemoved(false)
    setcatalogExtensionAdded(true)
    }
    else{
    setcatalogExtensionRemoved(true)
    setcatalogExtensionAdded(false)
    }
  }
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setcatalogExtensionRemoved(false)
    setcatalogExtensionAdded(false)
  };
    const renderArticles = () =>{
        if(catalog_name===undefined || catalogExtension===null || catalog_extension_name==null){
            return <div></div>
        }
        
        else{
            return (
                <div>
                <Pagination count={catalogExtension.page_count} page={page} onChange={handlePageChange} style={{marginTop:'20px',marginBottom:'20px'}}/>
                {catalogExtension.articles.map((article) => (
                <ExtensionCard article={article} key={article.DOI} handleNoCatalogExtensionSelected={()=>{}} 
                currentCatalog={catalog_name} currentExtension={catalog_extension_name} handleCatalogAdded={()=>{}} 
                catalogExtensionIdentifiers={catalogExtension.articles.map(v => v.DOI)}></ExtensionCard>
                
            ))}

                  {<Snackbar open={catalogExtensionAdded} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Article added to catalog extension succesfully!
        </Alert>
      </Snackbar>}
      {<Snackbar open={catalogExtensionRemoved} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          Article removed from catalog exteension succesfully!
        </Alert>
      </Snackbar>}
            </div>
            )
        }
    }
    return (<div>
        {renderArticles()}
    </div> 
        
   );
  
}
 


