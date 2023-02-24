import { Component, useState } from "react";

import UserService from "../services/user.service";

import SearchService from "../services/search.service"
import {SearchResult, Article } from "../services/search.service"
import BasicTabs from "./articleCard.component";
import { Alert, Pagination, Snackbar } from "@mui/material";
import CatalogBaseMenu from "./catalogBaseList.component";
import catalogService, { CatalogBase, ArticleIdentifier } from "../services/catalog.service";

type Props = {};

type State = {
  content: SearchResult | null
  searchInput: string
  loading: boolean,
  message: string
  page:number
  noCurrentCatalog: boolean | null
  currentCatalog: string | null
  openAlert: boolean
  catalogBaseAdded: boolean
  catalogBaseRemoved: boolean
  catalogBaseIdentifiers: ArticleIdentifier[]
}


export default class BoardUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: null,
      searchInput: "",
      loading: false,
      message: "",
      page:1,
      noCurrentCatalog:null,
      currentCatalog:null,
      openAlert:false,
      catalogBaseAdded: false,
      catalogBaseRemoved: false,
      catalogBaseIdentifiers: []
    };
  }

  /* componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  } */

  handleCatalogSelection = (catalog_name:string, catalog_base:CatalogBase) => {
    this.setState({currentCatalog:catalog_name})
    this.setState({catalogBaseIdentifiers: catalog_base.article_identifiers})
  }

  handleNoCatalogBaseSelected = () => {
    this.setState({openAlert:true});
    this.setState({noCurrentCatalog:true});
  };

  handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({openAlert:false});
    this.setState({catalogBaseAdded:false});
    this.setState({catalogBaseRemoved:false});
  };

  handleSearch = () => {
    
    
    const searchInput =  this.state.searchInput;
    const page = this.state.page

    SearchService.getSearchResult(searchInput, page.toString()).then(
      (response) => {
        let searchResult = response.data
        console.log(searchResult)
        this.setState({
          content: searchResult
        });
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }
  onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputData = e.target.value
    this.setState({ searchInput: inputData});
  }
  render() {
    
    return (
      <div className="container">
        <div className="input-group">
          <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" onChange={this.onSearchInputChange}/>
          <button type="button" className="btn btn-outline-primary" onClick={this.handleSearch}>search</button>
        </div>
        <header className="jumbotron">
          {this.formatContent()}
        </header>
      </div>
    );
  }
  handlePageChange = (event: any, value:number) =>{
    this.setState(
      {
        page: value
      },
      () => {
        this.handleSearch();
      }
    );
  }

  handleCatalogAdded = (added:boolean) => {
    if(added){
    this.setState({catalogBaseRemoved:false})
    this.setState({catalogBaseAdded:true})
    }
    else{
      this.setState({catalogBaseRemoved:true})
      this.setState({catalogBaseAdded:false})
    }
  }
  formatContent(){
    const { content, page } = this.state;
   
    if(content===null){
      return <div></div>
    }
    const articles: Article[] = [];
    for (var article of content.search_results) {
      articles.push(article)
    }
    return <div>
      <Pagination count={content.total_page_count} page={page} onChange={this.handlePageChange} style={{marginTop:'20px',marginBottom:'20px'}}/>
      <CatalogBaseMenu handleCatalogSelection={this.handleCatalogSelection}/>
      {articles.map((article) => (
        <BasicTabs article={article} key={article.DOI} handleNoCatalogBaseSelected={this.handleNoCatalogBaseSelected} currentCatalog={this.state.currentCatalog} handleCatalogAdded={this.handleCatalogAdded} catalogBaseIdentifiers={this.state.catalogBaseIdentifiers.map(v => v.DOI)}></BasicTabs>
      ))}
      {this.state.noCurrentCatalog ? <Snackbar open={this.state.openAlert} autoHideDuration={6000} onClose={this.handleClose}>
        <Alert onClose={this.handleClose} severity="error" sx={{ width: '100%' }}>
          Please choose a catalog base!
        </Alert>
      </Snackbar> : null}
      {<Snackbar open={this.state.catalogBaseAdded} autoHideDuration={6000} onClose={this.handleClose}>
        <Alert onClose={this.handleClose} severity="success" sx={{ width: '100%' }}>
          Article added to catalog base succesfully!
        </Alert>
      </Snackbar>}
      {<Snackbar open={this.state.catalogBaseRemoved} autoHideDuration={6000} onClose={this.handleClose}>
        <Alert onClose={this.handleClose} severity="info" sx={{ width: '100%' }}>
          Article removed from catalog base succesfully!
        </Alert>
      </Snackbar>}
    </div>
    
    
  }
}