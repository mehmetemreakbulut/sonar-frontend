import * as React from 'react';
import { Article, Author } from '../services/search.service';
import { Chip, Stack, Box, Typography, Tab,Tabs, Button, SpeedDial, SpeedDialIcon, SpeedDialAction, speedDialActionClasses, Switch, FormControlLabel, styled, CircularProgress } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import AddIcon from '@mui/icons-material/Add';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';

import CatalogService, { ArticleIdentifier } from '../services/catalog.service'
import LoadingButton from './loadingButton.component';

type TabPanelProps= {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function getFieldsOfStudy(fields: string[]){
    if(fields ===null){
        return <div></div>
    }
    return fields.map((field) => (
        <Chip label={field} color="primary" key={field}/>
    )
    )
  }
function getAuthors(authors: any[]){
   
    if(authors ===null){
        return <div></div>
    }
    
    return authors.map((author) => (
        <Chip icon={<FaceIcon />} label={author.author_name} variant="outlined" key={author.author_id}/>
    )
    )
  }

function getPublicationTypes(types: string[]){
    if(types ===null){
        return <div></div>
    }
    return types.map((type) => (
        <Chip label={type} color="secondary" key={type}/>
    )
    )
  }

function getCitationCount(citation_count:number){
    const citationCount = "Citation Count: " + citation_count
    return citationCount
}


const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
];

type ArticleProps ={
    article: Article,
    handleNoCatalogExtensionSelected: any,
    currentCatalog: string | null,
    currentExtension: string | null
    handleCatalogAdded:any
    catalogExtensionIdentifiers: string[]
}

export default function ExtensionCard(props:ArticleProps) {
  const {article, handleNoCatalogExtensionSelected, currentCatalog, currentExtension, handleCatalogAdded, catalogExtensionIdentifiers} = props
  const [value, setValue] = React.useState(0);
  const [switchChecked, setSwitchChecked] = React.useState<boolean | null>(null);
  const [addedToCatalog, setAddedToCatalog] =  React.useState<boolean | null>(null);
  const [removedFromCatalog, setRemovedFromCatalog] =  React.useState<boolean | null>(null);
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [finished, setFinished] = React.useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

    React.useEffect(() => {
    console.log("useEffect")
  }, [loading])
  
  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("test")
    if(!switchChecked){
      if (currentExtension===null || currentCatalog===null){
      handleNoCatalogExtensionSelected()
      return
    }
  else{
    setLoading(true)
    CatalogService.addPaperDOIToExtension(currentCatalog, currentExtension, article).then(
        (response) => {
        console.log("HERE")
        setAddedToCatalog(true);
        setLoading(false)
        handleCatalogAdded(true)
        setSwitchChecked(true)
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
        setAddedToCatalog(false);
        setLoading(false)
      }
    ); 
  }
  
    }
    else{
      if (currentExtension===null || currentCatalog == null){
      handleNoCatalogExtensionSelected()
      return
    }
  else{
    setLoading(true)
    CatalogService.removePaperDOIFromExtension(currentCatalog,currentExtension, article.DOI).then(
        (response) => {
          console.log('removing')
        setRemovedFromCatalog(true);
        handleCatalogAdded(false)
        setLoading(false)
        setSwitchChecked(false)
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
        setRemovedFromCatalog(false);
        setLoading(false)
      }
    );
  }
    }
  };

  const speedDialHandle = (action_name:string, article_doi:string) =>{
  if(action_name==='Add'){
    
    
  }
}
  const inCatalog = () =>{
  if(switchChecked!==null){
    return switchChecked
  }
  
  if(catalogExtensionIdentifiers.find(e => e === article.DOI)){
    setSwitchChecked(true)
    return true
  }
  else{
    setSwitchChecked(false)
    return false
  }
}
  console.log(article)

  const renderLabel = () => {
    if (inCatalog()) {
      return "Remove From Catalog Extension"
    }
    else {
      return "Add To Catalog Extension"
    }
  }
  const renderButton = () => {
          if(!loading){
    return (<FormControlLabel
        style={{marginLeft:'20px'}}
        control={<LoadingButton  loading={!finished && loading} done={finished} checked={inCatalog()} onChange={handleChangeSwitch}/>}
        label={''}
        />)
      }
            else{
        return (
          <div style={{marginLeft:'50px'}}>
                         <Button>
        <CircularProgress />
      </Button>
             </div>

        )
      }  
    } 
  return (
    <Box sx={{ width: '100%', transform: 'translateZ(0px)', flexGrow: 1 }}> 
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Abstract" {...a11yProps(1)} />
        </Tabs>
        
      </Box>
      <TabPanel value={value} index={0}>
        <Chip label={article.title} color="success" variant="outlined" style={{marginTop:'5px'}}/> <br/>
        <Chip label={article.DOI} variant="outlined" style={{marginTop:'5px'}}/> <br/>
        <Chip label={article.publication_date} variant="outlined" color="primary" icon={<InsertInvitationIcon />} style={{marginTop:'5px'}}/>
         <Stack direction="row" spacing={1} style={{marginTop:'5px'} }>
        {getPublicationTypes(article.publication_types)}
        </Stack>
        <Stack direction="row" spacing={1} style={{marginTop:'5px'}}>
        {getFieldsOfStudy(article.fields_of_study)}
        </Stack>
        <Chip label={getCitationCount(article.citation_count)} color='warning' style={{marginTop:'5px'}}/> <br/>
        <Stack direction="row" spacing={0}  style={{marginTop:'10px'}} sx={{ flexWrap: 'wrap', gap: 1, width:'85%' }} justifyContent="flex-start">
        {getAuthors(article.authors)}
        </Stack>
        
       
      </TabPanel>
      <TabPanel value={value} index={1}>
        {article.abstract}
      </TabPanel>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {speedDialHandle(action.name,article.DOI)}}
             
          />
        ))}
      </SpeedDial>


    
  
    </Box>
  );


}