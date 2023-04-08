import { Component } from "react";
import Button from '@mui/material/Button';
import { Navigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import Dialog from "@mui/material/Dialog";
import { Card, CardContent, Checkbox, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import GraphService from '../services/graph.services'
import CatalogService, { CatalogBaseForList } from "../services/catalog.service"
import type {CatalogBase} from "../services/catalog.service"
import ControlledAccordions from "./catalogs.component";
import CatalogExtensionMenu from "./catalogExtensionList.component";
import CommentIcon from '@mui/icons-material/Comment';
type Props = {};

type State = {
  redirect: string | null,
  userReady: boolean,
  currentUser: IUser & { token: string },
  isOpen: boolean
  catalogName: string | null
  catalogExtensionName: string | null
  isSuccess:boolean | null
  catalogBases: CatalogBaseForList[]
  mode:number
  catalogExtensionParent: string | null
  extensionChange:boolean
  graph_build_name: string | null
  graph_extension_name: string | null
  graph_build_bool: boolean
  checked: number[]
}
export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { token: "" },
      isOpen: false,
      catalogName: null,
      catalogExtensionName: null,
      isSuccess:  null,
      catalogBases: [],
      mode: 1,
      catalogExtensionParent: "",
      extensionChange: false,
      graph_build_name: null,
      graph_extension_name: null,
      graph_build_bool: false,
      checked: [0]
    };
  }

   

  handleToggle = (value: number) => () => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({checked:newChecked});
  };
  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })

    CatalogService.getAllCatalogBases().then(
      (response) => {
        let catalogBases = response.data
        this.setState({catalogBases: catalogBases})
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
  handleClickOpen = (mode:number, catalogExtensionParent: string|null) => () => {
    this.setState({isOpen:true,mode:mode});
    console.log(mode)
    if(mode===2){
        this.setState({catalogExtensionParent:catalogExtensionParent})
    }
  }

  handleClose = () => {
    this.setState({isOpen:false, isSuccess:null});
    this.componentDidMount()
  };

  handleCreateCatalog = () => {
    const catalogName = this.state.catalogName
    if(catalogName === null){
        return
    }
    CatalogService.createCatalogBase(catalogName).then(
        (response) => {
        
        this.setState({
          isSuccess: true
        });
      },
      error => {
        this.setState({
          isSuccess: false,
        });
      }
    );
  }
  handleCreateExtension = () => {
    const catalogExtensionParent = this.state.catalogExtensionParent
    if(catalogExtensionParent === null){
        return
    }
    if(this.state.catalogExtensionName === null){
        return
    }
    CatalogService.createCatalogExtension(catalogExtensionParent, this.state.catalogExtensionName).then(
        (response) => {
        
        this.setState({
          isSuccess: true,
          extensionChange: true
        });
      },
      error => {
        this.setState({
          isSuccess: false,
        });
      }
    );
  }

  onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const catalogName = e.target.value
    this.setState({ catalogName: catalogName});
  }

  onExtensionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const catalogExtensionName = e.target.value
    this.setState({ catalogExtensionName: catalogExtensionName});
  }

  extensionChangeHandle =(exist:boolean) => {
    this.setState({extensionChange:exist})
  }
  handleBuildGraph = () => {
    if ( this.state.graph_build_name === null || this.state.graph_extension_name === null) {
      return
    }
    GraphService.buildGraph(this.state.graph_build_name, this.state.graph_extension_name).then(
      (response) => {
   
        this.setState({isSuccess: true})
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
          console.log(resMessage)
          this.setState({isSuccess: false})
          
      }
    );
  }

 handleBuildGraphPopup = (catalog_name: string) => () => {
  
    this.setState({ graph_build_name: catalog_name});
    this.setState({graph_build_bool: true})
  }
  handleBuildPopupClose = () => {
    this.setState({ graph_build_name: null});
    this.setState({ graph_extension_name: null});
    this.setState({graph_build_bool: false})
    this.setState({ isSuccess: null});
  }
  handleExtensionForBuild = (catalog_extension_name:string, catalog_extension:string) => {
    this.setState({ graph_extension_name: catalog_extension});
  }
  
 
  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    console.log("he")
    const { currentUser } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
          <div>
                  <div >
        <Card style={{minWidth:"275", marginBottom:"20px"}}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Catalog Base
        </Typography>
        <Typography style={{marginBottom:"12"}} color="textSecondary">
          Catalog Base is the main catalog that you can create extensions from. You can add papers to catalog base via search page.
        </Typography>
  
      </CardContent>
      <CardContent>
        <Typography variant="h5" component="h2">
          Catalog Extension
        </Typography>
        <Typography style={{marginBottom:"12"}} color="textSecondary">
          Catalog Extension is the catalog that you can create from catalog base. You can add papers to catalog extension via 'Edit Extensions'. Adding citations or references options are available now!
        </Typography>
  
      </CardContent>
    </Card>
      <Divider>
    <Chip label="CATALOGS" />
  </Divider>
      </div>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={this.handleClickOpen(1, null)} style={{marginBottom:"20px"}}>
            Create Catalog Base
            </Button>
            <Dialog onClose={this.handleClose} open={this.state.isOpen}>
      <DialogTitle>{(this.state.mode===1) ? "Name your Catalog Base!" : "Are you sure?"}</DialogTitle>
      {(this.state.mode===1) ? renderCatalogBaseCreate(this.state.isSuccess, this.onSearchInputChange, this.handleCreateCatalog): renderCatalogExtensionCreate(this.state.isSuccess, this.state.catalogExtensionParent, this.handleCreateExtension, this.handleClose, this.onExtensionInputChange, this.state.checked, this.handleToggle)}
    </Dialog>
    <Dialog onClose={this.handleBuildPopupClose} open={this.state.graph_build_bool == true}>
      <DialogTitle>{"Please choose an extension for catalog base" + this.state.graph_build_name}</DialogTitle>
       {renderBuildGraph(this.state.isSuccess, this.handleBuildGraph, this.handleExtensionForBuild, this.state.graph_build_name)}
       </Dialog>
    
    <ControlledAccordions catalogBases={this.state.catalogBases} catalogExtensions={[]} handleClickOpen={this.handleClickOpen} extensionChangeHandle={this.extensionChangeHandle} extensionChange={this.state.extensionChange} handleBuildGraphPopup={this.handleBuildGraphPopup}></ControlledAccordions>
          </div>
           : null}
          
      </div>
    );
  }
}
function renderBuildGraph(isSuccess:boolean|null, handleBuildGraph: any,handleExtensionForBuild: any, catalog_name: string | null) {
  if (catalog_name == null) {
    return <div></div>
  }
  return (
        <div className="container">
          <CatalogExtensionMenu handleCatalogExtensionSelection={handleExtensionForBuild} catalog_name={catalog_name.toString()}/> 
        <div className="input-group" style={{padding:'10px'}}>
          <button type="button" className="btn btn-outline-primary" onClick={handleBuildGraph}>Add</button>
        </div>
        {isSuccess && (
                <div className="form-group" style={{paddingTop: '10px'}}>
                  <div className="alert alert-success" role="alert">
                    Successfully created.
                  </div>
                </div>
              )}
        {isSuccess===false && (
                <div className="form-group" style={{paddingTop: '10px'}}>
                  <div className="alert alert-danger" role="alert">
                    Graph not created!
                  </div>
                </div>
              )}
      </div>
    )
}
function renderCatalogBaseCreate(isSuccess:boolean|null,onSearchInputChange:any, handleCreateCatalog:any){
    return (
        <div className="container">
        <div className="input-group" style={{padding:'10px'}}>
          <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" onChange={onSearchInputChange}/>
          <button type="button" className="btn btn-outline-primary" onClick={handleCreateCatalog}>Add</button>
        </div>
        {isSuccess && (
                <div className="form-group" style={{paddingTop: '10px'}}>
                  <div className="alert alert-success" role="alert">
                    Successfully created.
                  </div>
                </div>
              )}
        {isSuccess===false && (
                <div className="form-group" style={{paddingTop: '10px'}}>
                  <div className="alert alert-danger" role="alert">
                    There is a catalog base with this name.
                  </div>
                </div>
              )}
      </div>
    )
}

function renderCatalogExtensionCreate(isSuccess:boolean|null,  catalogExtensionParent:string|null,  handleCreateExtension:any, handleClose:any, onExtensionInputChange:any, checked:any, handleToggle:any){
    let optionMap = new Map();
    optionMap.set(0, "Add articles citing papers in my catalog base");
    optionMap.set(1, "Add articles cited by articles in my catalog base");
    optionMap.set(2, "add articles written by authors of the articles in my catalog");
    return (
        <div className="container">
        <DialogTitle id="alert-dialog-title">
          
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{'padding':'12px'}}>
            A catalog extension will be created for Catalog <strong>{catalogExtensionParent} </strong>!
          </DialogContentText>
   
          <input style={{borderWidth:'medium'}} type="search" className="form-control rounded" placeholder="Write name of catalog extension" aria-label="Search"  onChange={onExtensionInputChange}/>
       

        </DialogContent>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {[0, 1, 2].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={optionMap.get(value)} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateExtension} autoFocus>
            CREATE
          </Button>
        </DialogActions>
        {isSuccess && (
                <div className="form-group" style={{paddingTop: '10px'}}>
                  <div className="alert alert-success" role="alert">
                    Successfully created.
                  </div>
                </div>
              )}
        {isSuccess===false && (
                <div className="form-group" style={{paddingTop: '10px'}}>
                  <div className="alert alert-danger" role="alert">
                    You have 5 catalog extension already.
                  </div>
                </div>
              )}
      </div>
    )
}

