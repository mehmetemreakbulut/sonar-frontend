import { Box, Card, CardActions, CardContent, SpeedDial, Stack, Typography , Tab, Tabs,  Chip, SpeedDialIcon, SpeedDialAction} from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import { Author } from "../../services/search.service";
import FaceIcon from '@mui/icons-material/Face';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
export type ArticleSummary = {
  summary_type: string
  id:number
  doi: string;
  abstract: string;
  authors: string[];
  citation_count: number;
  fields_of_study: string[];
  publication_date: string;
  publication_types: string[];
  reference_count: number;
  title: string;
  year: number
};


export type Summary = {
    summary: ArticleSummary
}
interface Props {
    summaries: Summary[];
    setSummaries: Dispatch<SetStateAction<Summary[]>>;
    currentSummary: Summary | null;
    setCurrentSummary: Dispatch<SetStateAction<Summary | null>>;
}
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
function getAuthors(authors: any[]){
    if(authors ===null || authors === undefined){
        return <div></div>
    }

    return authors.map((author:any) => (
        <Chip icon={<FaceIcon />} label={author.author_name} variant="outlined" key={author.author_id}/>
    )
    )
  }

function getPublicationTypes(types: string[]){
    if(types ===null || types === undefined){
        return <div></div>
    }
    if (types.length === 0){
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

const WikipediaSummaries: React.FC<Props> = React.memo(
    ({ summaries, setSummaries, currentSummary, setCurrentSummary }) => {
        const handleCloseTab = (summary: Summary, i: number) => {
            const newSummaries = summaries.filter((s) => s !== summary);
            setSummaries(newSummaries);
            if (summary === currentSummary) {
                if (summaries.length === 1) {
                    setCurrentSummary(null);
                } else if (i < summaries.length - 1) {
                    setCurrentSummary(summaries[i + 1]);
                } else {
                    setCurrentSummary(summaries[i - 1]);
                }
            }
        };
        const [value, setValue] = React.useState(0);
        const speedDialHandle = (action_name:string, article_doi:string) =>{
  if(action_name==='Add'){
    
    
  }
}

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
];


const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
        if (currentSummary) {
            const card = (summary:ArticleSummary) =>(
            <React.Fragment>
                <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {summary.doi}
                </Typography>
                <Typography variant="h5" component="div">
                    {summary.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {summary.title}
                </Typography>
                <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
                </CardContent>
                <CardActions>
        
                </CardActions>
            </React.Fragment>
            );

            return (
                <div >
                    <div >
                        {summaries?.map((summary, i) => {
                            return (
                                <div
                                    className={`wikipedia-summary-tab ${
                                        summary === currentSummary ? "tab-selected" : ""
                                    }`}
                                    key={summary.summary.id}
                                    onClick={() => setCurrentSummary(summary)}
                                >
                                    <Box sx={{ width: '100%', transform: 'translateZ(0px)', flexGrow: 1 }}> 
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Abstract" {...a11yProps(1)} />
        </Tabs>
        
      </Box>
      <TabPanel value={value} index={0}>
       
        <strong>Title:  </strong><Chip label={summary.summary.title} color="success" variant="outlined" style={{marginTop:'5px'}}/> <br/>
        <strong>DOI:  </strong><Chip label={summary.summary.doi} variant="outlined" style={{marginTop:'5px'}}/> <br/>
        <strong>Publication Date:  </strong><Chip label={summary.summary.publication_date} variant="outlined" color="primary" icon={<InsertInvitationIcon />} style={{marginTop:'5px'}}/> <br/>
        <strong>Publication Types:  </strong><Stack direction="row" spacing={1} style={{marginTop:'5px'} }> 
        {getPublicationTypes(summary.summary.publication_types)}
        </Stack> <br/>
        <strong>Fields of Study:  </strong><Stack direction="row" spacing={1} style={{marginTop:'5px'}}>
        {getFieldsOfStudy(summary.summary.fields_of_study)}
        </Stack><br/> 
        <strong>Citation Count:  </strong><Chip label={getCitationCount(summary.summary.citation_count)} color='warning' style={{marginTop:'5px'}}/> <br/>
        <strong>Authors:  </strong><Stack direction="row" spacing={0}  style={{marginTop:'10px'}} sx={{ flexWrap: 'wrap', gap: 1, width:'85%' }} justifyContent="flex-start">
        {getAuthors(summary.summary.authors)}
        </Stack>
        
       
      </TabPanel>
      <TabPanel value={value} index={1}>
        {summary.summary.abstract}
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
            onClick={() => {speedDialHandle(action.name,summary.summary.doi)}}
             
          />
        ))}
      </SpeedDial>
      
    </Box>
                                  
                                </div>
                            );
                        })}
                    </div>
                
                </div>
            );
        } else {
            return (
                <div id="wikipedia-summaries">
                    <div id="wikipedia-summary-tabs"></div>
                    <div className="wikipedia-summary">
            
                    </div>
                </div>
            );
        }
    }
);

export default WikipediaSummaries;