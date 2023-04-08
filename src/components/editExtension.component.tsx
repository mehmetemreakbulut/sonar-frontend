import * as React from 'react';
import { Component } from 'react';
import AuthService from "../services/auth.service";
import CatalogService, { ArticlePage, CatalogExtension } from "../services/catalog.service"
import { useParams } from 'react-router-dom';
import { Article } from '../services/search.service';
import catalogService, { ArticleIdentifier, CatalogBase } from '../services/catalog.service';
import { Box, Button, ButtonGroup, createMuiTheme, createTheme, Drawer, Pagination, TextField, Typography } from '@mui/material';
import BasicTabs from "./articleCard.component";
import CatalogExtensionMenu from './catalogExtensionList.component';
import CatalogEditExtensionPapers from './catalogExtEditPapers.component';
import { ScrollableComponentElement } from 'scrollable-component';
import { Anchor, ThemeProvider } from 'react-bootstrap';
 
type Anchor = 'See Catalog Base' | 'left' | 'bottom' | 'right';

export default function EditExtensionComponent(){

    const { catalog_name} = useParams();
    const [catalogExtension, setCatalogExtension] = React.useState<string | null>(null);
    const [catalogBase, setCatalogBase] = React.useState<ArticlePage | null>(null);
    const [changed, setChanged] = React.useState<boolean>(false);
    const [drawer, setDrawer] = React.useState<boolean>(false);
    const [ page, setPage ] = React.useState<number>(1);
    const [state, setState] = React.useState({
    top: false,
    'See Catalog Base': false,
    bottom: false,
    right: false,
  });

    React.useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        console.log("changed")

        
        
},[changed])

      React.useEffect(() => {
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
  }, []);
   
    const handleCatalogExtensionSelection = (catalog_extension_name:string, catalog_extension:string) => {
    setCatalogExtension(catalog_extension)

  }
    
    const addInbound = () => {
      console.log('INBOUND')
        if (catalog_name===undefined || catalogExtension ===null){
          console.log('hey')
            return
        }
        CatalogService.addInbound(catalog_name,catalogExtension).then(
      (response) => {
        console.log('inbounds added')
        if(changed==true){
          setChanged(false)
        }
        if(changed==false){
          setChanged(true)
        }
        
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
  
        CatalogService.addOutbound(catalog_name,catalogExtension).then(
      (response) => {
        console.log('outbound adding')
      if(changed==true){
          setChanged(false)
        }
        if(changed==false){
          setChanged(true)
        }
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
    const handlePageChange = (event: any, value:number) =>{
        setPage(page)
    } 
    const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

    const list = (anchor: Anchor, catalog_name: string, catalogBase:ArticlePage)  => (
      <div>
    
    <Box
     sx={{ width:650 }}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, false)}
    >

        <div style={{overflowY:"auto", whiteSpace:"nowrap"}}>
                    
                  <Pagination count={catalogBase.page_count} page={page} onChange={handlePageChange} style={{marginTop:'20px',marginBottom:'20px'}}/>
                    {catalogBase.articles.map((article) => (
                <BasicTabs article={article} key={article.DOI} handleNoCatalogBaseSelected={()=>{}} 
                currentCatalog={catalog_name} handleCatalogAdded={()=>{}} 
                catalogBaseIdentifiers={catalogBase.articles.map(v => v.DOI)} allowUpdate={false}></BasicTabs>
            ))}
                  </div>
    </Box>
                      </div>
  );
    const renderExtension = () => {
        
        if (catalog_name===undefined || catalogExtension ===null || catalogBase == null){
            return <div></div>
        }
        else {
          console.log(catalogBase)
            return <div >
                <div>
      {(['See Catalog Base'] as const).map((anchor) => (
      
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer
            anchor='left'
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor, catalog_name, catalogBase)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
                <div  style={{display:"flex", overflow:"auto", gridTemplateColumns:"1fr 1fr" , gap:'50px'}} >
                    
                    
                 
                  
                  <div style={{overflowY:"auto", whiteSpace:"nowrap"}}>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={addInbound}>Add Inbound</Button>
                <Button onClick={addOutbound}>Add Outbound</Button>
                </ButtonGroup>
                      <CatalogEditExtensionPapers catalog_name={catalog_name} catalog_extension_name={catalogExtension}/>
                  </div>
                
                
                </div>

                
                
              
                
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
 


