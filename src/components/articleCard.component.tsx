import * as React from 'react';
import { Article, Author } from '../services/search.service';
import { Chip, Stack, Box, Typography, Tab,Tabs, Button, SpeedDial, SpeedDialIcon, SpeedDialAction, speedDialActionClasses, Switch } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import AddIcon from '@mui/icons-material/Add';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';

import CatalogService, { ArticleIdentifier } from '../services/catalog.service'

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
function getAuthors(authors: Author[]){
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
    handleNoCatalogBaseSelected: any,
    currentCatalog: string | null
    handleCatalogAdded:any
    catalogBaseIdentifiers: string[]
}

export default function BasicTabs(props:ArticleProps) {
  const {article, handleNoCatalogBaseSelected, currentCatalog, handleCatalogAdded, catalogBaseIdentifiers} = props
  const [value, setValue] = React.useState(0);
  const [switchChecked, setSwitchChecked] = React.useState<boolean | null>(null);
  const [addedToCatalog, setAddedToCatalog] =  React.useState<boolean | null>(null);
  const [removedFromCatalog, setRemovedFromCatalog] =  React.useState<boolean | null>(null);
  const [checked, setChecked] = React.useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  
  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(!switchChecked){
      if (currentCatalog===null){
      handleNoCatalogBaseSelected()
      return
    }
  else{
    CatalogService.addPaperDOIToBase(currentCatalog, article).then(
        (response) => {
        setAddedToCatalog(true);
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
      }
    );
  }
  
    }
    else{
      if (currentCatalog===null){
      handleNoCatalogBaseSelected()
      return
    }
  else{
    CatalogService.removePaperDOIFromBase(currentCatalog, article.DOI).then(
        (response) => {
        setRemovedFromCatalog(true);
        handleCatalogAdded(false)
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
  
  if(catalogBaseIdentifiers.find(e => e === article.DOI)){
    setSwitchChecked(true)
    return true
  }
  else{
    setSwitchChecked(false)
    return false
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
      <Switch
      checked={inCatalog()}
      onChange={handleChangeSwitch}
      inputProps={{ 'aria-label': 'controlled' }}
      />
  
    </Box>
  );


}