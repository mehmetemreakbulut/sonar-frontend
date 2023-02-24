import * as React from 'react';
import { Component } from 'react';
import AuthService from "../services/auth.service";
import CatalogService, { CatalogExtension } from "../services/catalog.service"
import { useParams } from 'react-router-dom';
import { Article } from '../services/search.service';
import { ArticleIdentifier, CatalogBase } from '../services/catalog.service';
import { Button, ButtonGroup, Pagination, TextField, Typography } from '@mui/material';
import BasicTabs from "./articleCard.component";
import CatalogExtensionMenu from './catalogExtensionList.component';
import CatalogEditExtensionPapers from './catalogExtEditPapers.component';
 
export default function EditExtensionComponent(){

    const { catalog_name} = useParams();
    const [catalogExtension, setCatalogExtension] = React.useState<CatalogExtension | null>(null);
    const [changed, setChanged] = React.useState<boolean>(false);
    const [ page, setPage ] = React.useState<number>(1);

    React.useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        console.log("changed")
        
},[catalogExtension])
   
    const handleCatalogExtensionSelection = (catalog_extension_ame:string, catalog_extension:CatalogExtension) => {
    setCatalogExtension(catalog_extension)

  }

    const addInbound = () => {
        if (catalog_name===undefined || catalogExtension ===null){
            return
        }
        CatalogService.addInbound(catalog_name,catalogExtension.catalog_extension_name).then(
      (response) => {
        setCatalogExtension(response.data.catalog_extension)
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
    }

    const addOutbound = () => {
        if (catalog_name===undefined || catalogExtension ===null){
            return
        }
  
        CatalogService.addOutbound(catalog_name,catalogExtension.catalog_extension_name).then(
      (response) => {
        setCatalogExtension(response.data.catalog_extension)
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
    }

    const renderExtension = () => {
     
        if (catalog_name===undefined || catalogExtension ===null){
            return <div></div>
        }
        else {
            return <div>
                                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={addInbound}>Add Inbound</Button>
                <Button onClick={addOutbound}>Add Outbound</Button>
                </ButtonGroup>
                <CatalogEditExtensionPapers catalog_name={catalog_name} catalog_extension={catalogExtension}/>

            </div>
        }
    }
    return (
        <div>
            <Typography variant="h5" gutterBottom style={{"textAlign":"center"}}>
        {"Catalog Name: " + catalog_name}
      </Typography>
        <CatalogExtensionMenu handleCatalogExtensionSelection={handleCatalogExtensionSelection} catalog_name={catalog_name}/> 
        {renderExtension()}
        </div>
   );
  
}
 


