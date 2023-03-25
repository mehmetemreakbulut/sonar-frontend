import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CatalogBase, CatalogBaseForList, CatalogExtension } from '../services/catalog.service';
import CatalogService from '../services/catalog.service'
import GraphService from '../services/graph.services'
import { Button, Card, CardContent, Chip, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function ControlledAccordions(props: any) {
  const catalogBases = props.catalogBases
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [graphBuildName, setGraphBuildName] = React.useState<string | null>(null);
  const [buildOpen , setBuildOpen] = React.useState<boolean>(false)
  const [selectedExtension , setSelectedExtension] = React.useState<string | null >(null)

  const [[catalogName,catalogExtensions], setCatalogExtensions] = React.useState<[string|null,string[]]>([null,[]]);
 

  React.useEffect(() => {
    console.log(props.extensionChange, expanded)
  if(props.extensionChange && expanded!==false){
    console.log("jann", expanded)
    CatalogService.getCatalogExtensionNames(expanded).then(
    (response) => {

    setCatalogExtensions([expanded,response.data])
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
    props.extensionChangeHandle(false);
    }
  }, [props.extensionChange]);
 

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      console.log(panel,catalogName,props.extensionChange)
      if(panel!==catalogName || (props.extensionChange)){
      setCatalogExtensions([panel,[]])
      CatalogService.getCatalogExtensionNames(panel).then(
      (response) => {
   
        setCatalogExtensions([panel,response.data])
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
      console.log("here")
      setExpanded(isExpanded ? panel : false);
      
      props.extensionChangeHandle(false)
      
    };
    const getExtensions = (extensions: string[], catalog_name: string)=>{
    
        return extensions.map((extension, index) => (
            <a href={`/catalogPapers/${catalog_name}/${extension}`}>
            <Chip label={extension} variant="outlined" key={index} color="primary"/>
            </a>
        )
    )
  }

  
  const renderCatalogBases = (catalogBases:CatalogBaseForList[]) =>{
      return catalogBases.map(catalogBase=>
        <Accordion key={catalogBase.catalog_base_name} expanded={expanded === catalogBase.catalog_base_name} onChange={handleChange(catalogBase.catalog_base_name)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={catalogBase.catalog_base_name + "bh-content"}
          id={catalogBase.catalog_base_name + "bh-header"}
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {catalogBase.catalog_base_name} <Tooltip title="Paper Count"><Chip label={catalogBase.article_count} color="primary" variant="outlined"  style={{marginLeft:"10px"}}/></Tooltip>
          </Typography>
            <a href={`/catalogPapers/${catalogBase.catalog_base_name}`}>
            <Button variant="outlined" startIcon={<AddIcon />} >
            Show Papers
            </Button></a>

          <Typography style={{marginLeft:"10px"}} sx={{ color: 'text.secondary' }}><Button variant="outlined" startIcon={<AddIcon />} onClick={props.handleClickOpen(2, catalogBase.catalog_base_name)}>
            Create Catalog Extension</Button>
            <a href={`/catalogPapers/edit/${catalogBase.catalog_base_name}`}>
            <Button style={{marginLeft:"10px"}} variant="outlined" startIcon={<AddIcon />} >
            Edit Extensions
            </Button></a>
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
  
            <Stack direction="row" spacing={0}  sx={{ flexWrap: 'wrap', gap: 1, width:'85%' }} justifyContent="flex-start">
        {getExtensions(catalogExtensions,catalogBase.catalog_base_name)}
        </Stack>
            
          
        </AccordionDetails>
      </Accordion>
      )
  }
  return (
    <div>
      {renderCatalogBases(catalogBases)}
    </div>
  );
}


