import * as React from 'react';
import { Article, Author } from '../services/search.service';
import { Chip, Stack, Box, Typography, Tab,Tabs, Button, SpeedDial, SpeedDialIcon, SpeedDialAction, speedDialActionClasses, Switch, FormControlLabel, styled, CircularProgress } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import AddIcon from '@mui/icons-material/Add';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import LoadingButton from './loadingButton.component';
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
    if(fields ===null || fields===undefined){
        return <div></div>
    }
    return fields.map((field) => (
        <Chip label={field} color="primary" key={field}/>
    )
    )
  }
function getAuthors(authors: Author[]){
    if(authors ===null || authors === undefined){
        return <div></div>
    }

    const getLabel = (author:any) => {
      return (author.author_name===undefined)? author:author.author_name
    }

    const getKey = (author:any) => {
      return (author.author_name===undefined) ? author : author.author_id
    }
    return authors.map((author:Author) => (
        <Chip icon={<FaceIcon />} label={getLabel(author)} variant="outlined" key={getKey(author)}/>
    )
    )
  }

function getPublicationTypes(types: string[]){
    if(types ===null || types === undefined){
        return <div></div>
    }
    console.log(types)
    return types.map((type:string) => (
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
    allowUpdate: boolean
    score?: number
}
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
              content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#4E5B94',
      },
    },
  },

  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
},
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function BasicTabs(props:ArticleProps) {
  const {article, handleNoCatalogBaseSelected, currentCatalog, handleCatalogAdded, catalogBaseIdentifiers, allowUpdate, score} = props

  const [value, setValue] = React.useState(0);
  const [switchChecked, setSwitchChecked] = React.useState<boolean | null>(null);
  const [addedToCatalog, setAddedToCatalog] =  React.useState<boolean | null>(null);
  const [removedFromCatalog, setRemovedFromCatalog] =  React.useState<boolean | null>(null);
  const [oldCatalog, setOldCatalog] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [finished, setFinished] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
 
  React.useEffect(() => {
    console.log("useEffect")
  }, [loading])

  React.useEffect(() => {
    console.log(article)
    console.log(catalogBaseIdentifiers)
  }, []) 
const addPaper = async () => {
  if (currentCatalog===null){
    handleNoCatalogBaseSelected()
    return
  }
  
  CatalogService.addPaperDOIToBase(currentCatalog, article).then(
        (response) => {
        console.log(loading)
        setAddedToCatalog(true);
        setLoading(false)
        handleCatalogAdded(true, article)
        setSwitchChecked(true)
        console.log(switchChecked)
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
    )
}
  const handleChangeSwitch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if(!switchChecked){
      if (currentCatalog===null){
      handleNoCatalogBaseSelected()
      return
    }
  else{
    setLoading(true)
    console.log("addingggg")
    await addPaper()
    console.log("ended")
    console.log(loading)

  }
  
    }
    else{
      console.log("here")
      if (currentCatalog===null){
      handleNoCatalogBaseSelected()
      return
    }
  else{
    setLoading(true) 
    console.log("removingggg")
    CatalogService.removePaperDOIFromBase(currentCatalog, article.DOI).then(
        (response) => {
        console.log("why not here")
        setRemovedFromCatalog(true);
        setLoading(false)
        handleCatalogAdded(false, article)
        setSwitchChecked(false)
        console.log(switchChecked)
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
    console.log(switchChecked)
    console.log(catalogBaseIdentifiers)

  if(catalogBaseIdentifiers.find(e => e === article.DOI)){
    if(switchChecked===true){
      return switchChecked
    }
    setSwitchChecked(true)
    return true
  }
  else{
    if(switchChecked===false){
      return switchChecked
    }
   setSwitchChecked(false)
    return false
  }
}
  const renderLabel = () => {
    if (inCatalog()) {
      return "Remove From Catalog"
    }
    else {
      return "Add To Catalog"
    }
  }
  const renderSwitch = () => {
    console.log("renderSwitch")
    console.log(loading)
    if (allowUpdate) {
      if(!loading){
    return <FormControlLabel
        style={{marginLeft:'20px'}}
        control={<LoadingButton  loading={!finished && loading} done={finished} checked={inCatalog()} onChange={handleChangeSwitch}/>}
        label={''}
        />
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
      
return <Switch
      checked={inCatalog()}
      onChange={handleChangeSwitch}
      inputProps={{ 'aria-label': 'controlled' }}
      />
    }
    else {
      return <div></div>
    }
  }
  const renderScore = () => {
    if(score === undefined) {
      return <div></div>
    }
    else {
      return <Chip label={score} color="secondary"  style={{marginTop:'5px'}}/>
    }
  }
  const renderScore2 = () => {
    if(score === undefined) {
      return <div></div>
    }
    else {
      return <strong>Score:  </strong>
    }
  }
  console.log(getAuthors(article.authors))
  return (
    <Box sx={{ width: '100%', transform: 'translateZ(0px)', flexGrow: 1 }}> 
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Abstract" {...a11yProps(1)} />
        </Tabs>
        
      </Box>
      <TabPanel value={value} index={0}>
        {renderScore2()}{renderScore()} <br/>
        <strong>Title:  </strong><Chip label={article.title} color="success" variant="outlined" style={{marginTop:'5px'}}/> <br/>
        <strong>DOI:  </strong><Chip label={article.DOI} variant="outlined" style={{marginTop:'5px'}}/> <br/>
        <strong>Publication Date:  </strong><Chip label={article.publication_date} variant="outlined" color="primary" icon={<InsertInvitationIcon />} style={{marginTop:'5px'}}/> <br/>
        <strong>Publication Types:  </strong><Stack direction="row" spacing={1} style={{marginTop:'5px'} }> 
        {getPublicationTypes(article.publication_types)}
        </Stack> <br/>
        <strong>Fields of Study:  </strong><Stack direction="row" spacing={1} style={{marginTop:'5px'}}>
        {getFieldsOfStudy(article.fields_of_study)}
        </Stack><br/> 
        <strong>Citation Count:  </strong><Chip label={getCitationCount(article.citation_count)} color='warning' style={{marginTop:'5px'}}/> <br/>
        <strong>Authors:  </strong><Stack direction="row" spacing={0}  style={{marginTop:'10px'}} sx={{ flexWrap: 'wrap', gap: 1, width:'85%' }} justifyContent="flex-start">
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
      {renderSwitch()}
    </Box>
  );


}
