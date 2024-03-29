import React from "react";
import { Navigate } from "react-router-dom";
import IUser from "../../types/user.type";
import AuthService from "../../services/auth.service";
import AnalyzeService from "../../services/analyze.service."
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/material/Icon';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import { Button, Chip, FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack } from "@mui/material";
import { string } from "yup";
import BasicTabs from "../articleCard.component";

import { Article } from "../../services/search.service";
import CatalogService, { CatalogBase, CatalogBaseForList } from "../../services/catalog.service";

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
];

type GraphAuthor = {
    affiliations: string[]
    citation_count: number
    h_index: number
    name: string
    paper_count: number
}
type AuthorData = {
    Author: GraphAuthor
    betweenness_centrality_score?: number
    closeness_centrality_score?: number
    eigenvector_centrality_score?:number
    degree_centrality_score?:number
    pagerank_score?:number
    article_rank_score?:number
    harmonic_centrality_score?:number
}

type ArticleData = {
    Article: Article
    betweenness_centrality_score?: number
    closeness_centrality_score?:number
    eigenvector_centrality_score?:number
    degree_centrality_score?:number
    pagerank_score?:number
    article_rank_score?:number
    harmonic_centrality_score?:number
}
type BetweennessData = {
    node_type: string
    data: AuthorData[] | ArticleData[]
    total_count: number
    page_count : number
}


export default function AnalysisPage() {
    const [redirect, setRedirect] = React.useState<string | null>(null);
    const [userReady, setUserReady] = React.useState<boolean>(false);
    const [currentUser, setCurrentUser] = React.useState<IUser & { token: string }>({ token: "" });
    const [value, setValue] = React.useState(0);


    const [BetwNode, setBetwNode] = React.useState('');
    const [BetwEdge, setBetwEdge] = React.useState('');
    const [BetwCatalogBase, setBtwCatalogBase] = React.useState('');
    const [BetwCatalogExt, setBtwCatalogExt] = React.useState('');
    const [betweennessSchema, setBetweennessSchema] =React.useState<BetweennessData | null>(null);

    const [ClosNode, setClosNode] = React.useState('');
    const [ClosEdge, setClosEdge] = React.useState('');
    const [ClosCatalogBase, setClosCatalogBase] = React.useState('');
    const [ClosCatalogExt, setClosCatalogExt] = React.useState('');
    const [closenessSchema, setClosenessSchema] =React.useState<BetweennessData | null>(null);

    const [EigenNode, setEigenNode] = React.useState('');
    const [EigenEdge, setEigenEdge] = React.useState('');
    const [EigenCatalogBase, setEigenCatalogBase] = React.useState('');
    const [EigenCatalogExt, setEigenCatalogExt] = React.useState('');
    const [eigenSchema, setEigenSchema] =React.useState<BetweennessData | null>(null);

    const [DegreeNode, setDegreeNode] = React.useState('');
    const [DegreeEdge, setDegreeEdge] = React.useState('');
    const [DegreeCatalogBase, setDegreeCatalogBase] = React.useState('');
    const [DegreeCatalogExt, setDegreeCatalogExt] = React.useState('');
    const [DegreeSchema, setDegreeSchema] =React.useState<BetweennessData | null>(null);

    const [PagerankNode, setPagerankNode] = React.useState('');
    const [PagerankEdge, setPagerankEdge] = React.useState('');
    const [PagerankCatalogBase, setPagerankCatalogBase] = React.useState('');
    const [PagerankCatalogExt, setPagerankCatalogExt] = React.useState('');
    const [PagerankSchema, setPagerankSchema] =React.useState<BetweennessData | null>(null);

    const [ArticlerankNode, setArticlerankNode] = React.useState('');
    const [ArticlerankEdge, setArticlerankEdge] = React.useState('');
    const [ArticlerankCatalogBase, setArticlerankCatalogBase] = React.useState('');
    const [ArticlerankCatalogExt, setArticlerankCatalogExt] = React.useState('');
    const [ArticlerankSchema, setArticlerankSchema] =React.useState<BetweennessData | null>(null);

    const [HarmonicNode, setHarmonicNode] = React.useState('');
    const [HarmonicEdge, setHarmonicEdge] = React.useState('');
    const [HarmonicCatalogBase, setHarmonicCatalogBase] = React.useState('');
    const [HarmonicCatalogExt, setHarmonicCatalogExt] = React.useState('');
    const [HarmonicSchema, setHarmonicSchema] =React.useState<BetweennessData | null>(null);


    const [ page0, setPage0 ] = React.useState<number>(1);
    const [ page1, setPage1 ] = React.useState<number>(1);
    const [ page2, setPage2 ] = React.useState<number>(1);
    const [ page3, setPage3 ] = React.useState<number>(1);
    const [ page4, setPage4 ] = React.useState<number>(1);
    const [ page5, setPage5 ] = React.useState<number>(1);
    const [ page6, setPage6 ] = React.useState<number>(1);

    const [catalogBases, setcatalogBases] = React.useState<CatalogBaseForList[]>([]);
    const [catalogExtensions, setcatalogExtension] = React.useState<string[]>([]);
    const [catalogDupChanged, setCatalogDupChanged] = React.useState<boolean>(false);

        React.useEffect(() => {
    CatalogService.getAllCatalogBases().then(
      (response) => {
        let catalogBases = response.data
        setcatalogBases(catalogBases)
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
  }, [catalogDupChanged])



      React.useEffect(() => {
    CatalogService.getAllCatalogBases().then(
      (response) => {
        let catalogBases = response.data
        setcatalogBases(catalogBases)
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
  }, [])
        
    React.useEffect(()=> {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            setRedirect("/home");
        }
        setCurrentUser(currentUser) 
        setUserReady(true )
        console.log('rendered')

    }, [betweennessSchema])
    if (redirect) {
      return <Navigate to={redirect} />
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    
  };

  const handleNodeChange = (event: SelectChangeEvent) => {
    if(value==0){
        setBetwNode(event.target.value as string);
  
    }   
    else if(value==1){
        setClosNode(event.target.value as string)
    }
    else if(value==2){
        setEigenNode(event.target.value as string)

    }
    else if(value==3){
        setDegreeNode(event.target.value as string)
    }
    else if(value==4){
        setPagerankNode(event.target.value as string)
    }
    else if(value==5){
        setArticlerankNode(event.target.value as string)
    }
    else if(value==6){
        setHarmonicNode(event.target.value as string)
    }

  };

  const handleEdgeChange = (event: SelectChangeEvent) => {
    if(value==0){
        setBetwEdge(event.target.value as string);
    }  
    if(value==1){
        setClosEdge(event.target.value as string);
    }
    if(value==2){
        setEigenEdge(event.target.value as string);
    } 
    if(value==3){
        setDegreeEdge(event.target.value as string);
    } 
    if(value==4){
        setPagerankEdge(event.target.value as string);
    } 
    if(value==5){
        setArticlerankEdge(event.target.value as string);
    } 
    if(value==6){
        setHarmonicEdge(event.target.value as string);
    } 
     
    console.log(ClosEdge)
  };


  const handleCatalogBaseChange = (event: SelectChangeEvent) => {
    if(value==0){
        setBtwCatalogBase(event.target.value as string);
    }  
    if(value==1){
        setClosCatalogBase(event.target.value as string);
    }
    if(value==2){
        setEigenCatalogBase(event.target.value as string);
    } 
    if(value==3){
        setDegreeCatalogBase(event.target.value as string);
    } 
    if(value==4){
        setPagerankCatalogBase(event.target.value as string);
    } 
    if(value==5){
        setArticlerankCatalogBase(event.target.value as string);
    } 
    if(value==6){
        setHarmonicCatalogBase(event.target.value as string);
    } 
    
        CatalogService.getCatalogExtensionNames(event.target.value as string).then(
      (response) => {
        let catalogExtensions = response.data
        setcatalogExtension(catalogExtensions)
        setCatalogDupChanged(true)
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

  };

    const handleCatalogExtChange = (event: SelectChangeEvent) => {
    if(value==0){
        setBtwCatalogExt(event.target.value as string);
    }  
    if(value==1){
        setClosCatalogExt(event.target.value as string);
    }
    if(value==2){
        setEigenCatalogExt(event.target.value as string);
    } 
    if(value==3){
        setDegreeCatalogExt(event.target.value as string);
    } 
    if(value==4){
        setPagerankCatalogExt(event.target.value as string);
    } 
    if(value==5){
        setArticlerankCatalogExt(event.target.value as string);
    } 
    if(value==6){
        setHarmonicCatalogExt(event.target.value as string);
    } 

  };


  const setAnalyzeData = () => {
    let metric;
    let centrality_node_type: string;
    let centrality_edge_type: string;
    let catalog_base: string;
    let catalog_extension: string;
    if(value==0){
        metric = "betweenness"
        centrality_node_type=BetwNode
        centrality_edge_type=BetwEdge
        catalog_base=BetwCatalogBase
        catalog_extension=BetwCatalogExt

    }
    else if(value==1){
        metric = "closeness"
        centrality_node_type=ClosNode
        centrality_edge_type=ClosEdge
        catalog_base=ClosCatalogBase
        catalog_extension=ClosCatalogExt
    }
    else if(value==2){
        metric = "eigenvector"
        centrality_node_type=EigenNode
        centrality_edge_type=EigenEdge
        catalog_base=EigenCatalogBase
        catalog_extension=EigenCatalogExt
    }
    else if(value==3){
        metric = "degree"
        centrality_node_type=DegreeNode
        centrality_edge_type=DegreeEdge
        catalog_base=DegreeCatalogBase
        catalog_extension=DegreeCatalogExt
    }
    else if(value==4){
        metric = "pagerank"
        centrality_node_type=PagerankNode
        centrality_edge_type=PagerankEdge
        catalog_base=PagerankCatalogBase
        catalog_extension=PagerankCatalogExt
    }
    else if(value==5){
        metric = "articlerank"
        centrality_node_type=ArticlerankNode
        centrality_edge_type=ArticlerankEdge
        catalog_base=ArticlerankCatalogBase
        catalog_extension=ArticlerankCatalogExt
    }
    else if(value==6){
        metric = "harmonic"
        centrality_node_type=HarmonicNode
        centrality_edge_type=HarmonicEdge
        catalog_base=HarmonicCatalogBase
        catalog_extension=HarmonicCatalogExt
    }
    else{
        setBetweennessSchema(null)
        return
    }
    
        AnalyzeService.getCentrality(centrality_node_type, centrality_edge_type, metric, catalog_base, catalog_extension).then(
      (response) => {
        let nodeData;
        if (centrality_node_type == 'Author') {
           
            let dump: AuthorData[] = response.data
            nodeData = dump
            
        }
        else {
            let dump: ArticleData[] = response.data
            for (let i = 0; i < dump.length; i++) {
                if (dump[i].Article.doi === undefined){
                    continue   
                }
                else{
                    let d = dump[i].Article.doi?.toString()
                    if (d === undefined){
                        continue
                    }
                    dump[i].Article.DOI = d
                }      
            }
            nodeData = dump
        }
   
        let betweennessData : BetweennessData = {
            node_type: centrality_node_type,
            data : nodeData,
            total_count: response.data.length,
            page_count: Math.ceil(response.data.length/25)
        }
        console.log(betweennessData)
        if(value==0){
        setBetweennessSchema(betweennessData)
        }
        else if(value==1){
            setClosenessSchema(betweennessData)
        }
        else if(value==2){
            setEigenSchema(betweennessData)
        }
        else if(value==3){
            setDegreeSchema(betweennessData)
        }
        else if(value==4){
            setPagerankSchema(betweennessData)
        }
        else if(value==5){
            setArticlerankSchema(betweennessData)
        }
        else if(value==6){
            setHarmonicSchema(betweennessData)
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
  

  const returnNodeValue = () => {
    switch(value){
        case 0:
            return BetwNode
        case 1:
            return ClosNode
        case 2:
            return EigenNode
        case 3:
            return DegreeNode
        case 4:
            return PagerankNode
        case 5:
            return ArticlerankNode
        case 6:
            return HarmonicNode
    }

  }

  const returnEdgeValue = () => {
    switch(value){
        case 0:
            return BetwEdge
        case 1:
            return ClosEdge
        case 2:
            return EigenEdge
        case 3:
            return DegreeEdge
        case 4:
            return PagerankEdge
        case 5:
            return ArticlerankEdge
        case 6:
            return HarmonicEdge
    }
  }

    const returnCatalogBasealue = () => {
    switch(value){
        case 0:
            return BetwCatalogBase
        case 1:
            return ClosCatalogBase
        case 2:
            return EigenCatalogBase
        case 3:
            return DegreeCatalogBase
        case 4:
            return PagerankCatalogBase
        case 5:
            return ArticlerankCatalogBase
        case 6:
            return HarmonicCatalogBase
    }
  }


      const returnCatalogExtensionlue = () => {
    switch(value){
        case 0:
            return BetwCatalogExt
        case 1:
            return ClosCatalogExt
        case 2:
            return EigenCatalogExt
        case 3:
            return DegreeCatalogExt
        case 4:
            return PagerankCatalogExt
        case 5:
            return ArticlerankCatalogExt
        case 6:
            return HarmonicCatalogExt
    }
  }

  const returnSchemaValue = () => {
    switch(value){
        case 0:
            return betweennessSchema
        case 1:
            return closenessSchema
        case 2:
            return eigenSchema
        case 3:
            return DegreeSchema
        case 4:
            return PagerankSchema
        case 5:
            return ArticlerankSchema
        case 6:
            return HarmonicSchema
    }
  }

  const returnScore = (obj: AuthorData | ArticleData) => {
    switch(value){
        case 0:
            return obj.betweenness_centrality_score
        case 1:
            return obj.closeness_centrality_score
        case 2:
            return obj.eigenvector_centrality_score
        case 3:
            return obj.degree_centrality_score
        case 4:
            return obj.pagerank_score
        case 5:
            return obj.article_rank_score
        case 6:
            return obj.harmonic_centrality_score
    }
  }
  const handlePageChange = (event: any, pageValue:number) =>{
    
        switch(value){
        case 0:
            return setPage0(pageValue)
        case 1:
            return setPage1(pageValue)
        case 2:
            return setPage2(pageValue)
        case 3:
            return setPage3(pageValue)
        case 4:
            return setPage4(pageValue)
        case 5:
            return setPage5(pageValue)
        case 6:
            return setPage6(pageValue)
    }
  }

  const getPage = () =>{
        switch(value){
        case 1:
            return page1
        case 2:
            return page2
        case 3:
            return page3
        case 4:
            return page4
        case 5:
            return page5
        case 6:
            return page6
        default:
            return page0
    }
  }

  const renderArticleNodes = () => {
    let nodeData;
    
    let dump = returnSchemaValue()

    if(dump == null || dump == undefined){
    return <div></div>
    } 
    nodeData = dump

    if(nodeData == undefined || nodeData== null) {
        return <div></div>
    }
    
   return (   
   <div>
                <Pagination count={nodeData.page_count} page={getPage()} onChange={handlePageChange} style={{marginTop:'20px',marginBottom:'20px'}}/>
                {nodeData.data.slice((25*(getPage()-1)),(25*getPage())).map((article:any) => (
                <BasicTabs article={article.Article} key={article.Article.doi} handleNoCatalogBaseSelected={()=>{}} 
                currentCatalog={'noCatalog'} handleCatalogAdded={()=>{}} 
                catalogBaseIdentifiers={[]} allowUpdate={false} score={returnScore(article)}></BasicTabs>
            ))}
        </div>
   )
  }

  const renderAuthorNodes = () => {
    let nodeData;
    
    let dump = returnSchemaValue()

    if(dump == null || dump == undefined){
    return <div></div>
    } 
    nodeData = dump

    if(nodeData == undefined || nodeData== null) {
        return <div></div>
    }
    
    if(nodeData == undefined || nodeData== null) {
        return <div></div>
    }

    if(nodeData.data.length == 0 ){
        return <div></div>
    }
    
    console.log(nodeData)
    return (<div>
                <Pagination count={nodeData.page_count} page={getPage()} onChange={handlePageChange} style={{marginTop:'20px',marginBottom:'20px'}}/>
                {nodeData.data.slice((25*(getPage()-1)),(25*getPage())).map((author:any) => (
                <Box sx={{ width: '100%', transform: 'translateZ(0px)', flexGrow: 1 , marginBottom: '20px',}}> 
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '10px' }}>
        
      </Box>
        <strong>Score:  </strong><Chip label={returnScore(author)} color="secondary"  style={{marginTop:'5px'}}/> <br></br>
        <strong>Name:  </strong><Chip label={author?.Author.name} color="success" variant="outlined" style={{marginTop:'5px'}}/> <br/>
        <strong>Citation Count:  </strong><Chip label={author?.Author.citation_count} color='warning' style={{marginTop:'5px'}}/> <br/>
        <strong>H-Index  </strong><Chip label={author?.Author.h_index} color='error' style={{marginTop:'5px'}}/> <br/>
        <strong>Paper Count:  </strong><Chip label={author.Author.paper_count} color='warning' style={{marginTop:'5px'}}/> <br/>
        <strong>Affiliations:  </strong><Stack direction="row" spacing={1} style={{marginTop:'5px'} }>
        {author?.Author.affiliations.map((affiliation:any) => (
        <Chip icon={<HomeIcon />} label={affiliation} variant="outlined" key={affiliation}/>
        )
        )}
        </Stack>
        <Button href={author.Author.s2ag_url}><Chip label={'Go to Author'} color='primary' style={{marginTop:'5px'}}/></Button><br/>

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
            onClick={() => {}}
             
          />
        ))}
      </SpeedDial>
    </Box>

            ))}
        </div>
    )
  }
  const renderAnaylysis = () => {
    console.log(value)
    
    let dump = returnSchemaValue()
    
    if(dump == null || dump == undefined) {
        return(
            <div></div>
        )
    } 
    else{
        
        if(dump.node_type=='Article'){
            return renderArticleNodes()
        }
        
        else if(dump.node_type == 'Author'){
            return renderAuthorNodes()
        }
        else {
            return <div></div>
        }

    }

  }
  return (
    <div>
    <div>
    <Box sx={{ maxWidth: { xs: 320, sm: 480, md: 1500 }, bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        <Tab label="Betwennes Centrality" />
        <Tab label="Closeness Centrality" />
        <Tab label="Eigenvector Centrality" />
        <Tab label="Degree Centrality" />
        <Tab label="PageRank" />
        <Tab label="ArticleRank" />
        <Tab label="Harmonic Centrality" />
      </Tabs>
    </Box>
    </div>
    <div className="rowC" style={{paddingTop:'30px'}}>
    <Box sx={{ minWidth: 120 }}>
      <FormControl style={{width:"100px"}}>
        <InputLabel id="demo-simple-select-label">Node</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={returnNodeValue()}

          label="Node"
          onChange={handleNodeChange}
        >
          <MenuItem value={'Article'}>Article</MenuItem>
          <MenuItem value={'Author'}>Author</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ minWidth: 120 }}>
      <FormControl style={{width:"100px"}} >
        <InputLabel id="demo-simple-select-label">Edge</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={returnEdgeValue()}
          label="Edge"
          onChange={handleEdgeChange}
        >
          <MenuItem value={"COAUTHOR_OF"}>COAUTHOR_OF</MenuItem>
          <MenuItem value={"CITES"}>CITES</MenuItem>
        </Select>
      </FormControl>
    </Box>
        <Box sx={{ minWidth: 120 }}>
      <FormControl style={{width:"100px"}} >
        <InputLabel id="demo-simple-select-label">Catalog Base</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={returnCatalogBasealue()}
          label="Catalog Base"
          onChange={handleCatalogBaseChange}
        >
        {catalogBases.map(v =><MenuItem value={v.catalog_base_name}>{v.catalog_base_name}</MenuItem> )}
        </Select>
      </FormControl>
    </Box>
            <Box sx={{ minWidth: 120 }}>
      <FormControl style={{width:"100px"}} >
        <InputLabel id="demo-simple-select-label">Catalog Extension</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={returnCatalogExtensionlue()}
          label="Catalog Extension"
          onChange={handleCatalogExtChange}
        >
          {catalogExtensions.map(v =><MenuItem value={v}>{v}</MenuItem> )}
        </Select>
      </FormControl>
    </Box>
    <Button color="info" onClick={setAnalyzeData} variant="contained">ANALYZE</Button>
    </div>
    {renderAnaylysis()}
    </div>
    
  );
}