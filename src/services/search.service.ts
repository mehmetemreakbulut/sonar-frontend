import axios from 'axios';
import authHeader from './authHeader';
const API_URL = 'http://localhost:8000/search/';

export type Author = {
  author_id: number,
  author_name: string,
} 
export type Article = {
  DOI: string;
  doi?: string;
  abstract: string;
  authors: Author[];
  citation_count: number;
  fields_of_study: string[];
  publication_date: string;
  publication_types: string[];
  reference_count: number;
  title: string;
  year: number
}
export type SearchResult = {
  search_results: Article[];
  offset: string;
  search_query: string;
  total_page_count: number
}

class SearchService {
  
  getSearchResult(search_query: string, offset: string) {
    return axios.get<SearchResult>(API_URL + 's2ag_search/?'+'search_query='+search_query+'&offset='+offset, { headers: authHeader() });
  }

}

export default new SearchService();