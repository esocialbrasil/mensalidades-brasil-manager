import { useEffect, useState } from "react";
import { Search, Check, X, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/mensalidades.css";

interface Company {
  id: string;
  name: string;
  document: string;
  status: "liberado" | "bloqueado";
  chargeType: "lives" | "fixed";
  lives?: number;
  valuePerLife?: number;
  fixedValue?: number;
  adjustmentType: "none" | "annual" | "periodic";
  adjustmentPercentage?: number;
  adjustmentMonth?: number;
  adjustmentPeriod?: number;
}

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showMassAdjustmentModal, setShowMassAdjustmentModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [massAdjustment, setMassAdjustment] = useState({
    adjustmentType: "none" as "none" | "annual" | "periodic",
    adjustmentPercentage: 0,
    adjustmentMonth: 1,
    adjustmentPeriod: 12
  });
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [companySearchResults, setCompanySearchResults] = useState<Company[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const dummyData: Company[] = [{
      id: "1",
      name: "Nome da empresa fictícia",
      document: "00.000.000/0000-00",
      status: "liberado",
      chargeType: "lives",
      lives: 50,
      valuePerLife: 66,
      adjustmentType: "annual",
      adjustmentPercentage: 10,
      adjustmentMonth: 3
    }, {
      id: "2",
      name: "Nome da empresa fictícia",
      document: "00.000.000/0000-00",
      status: "bloqueado",
      chargeType: "fixed",
      fixedValue: 840,
      adjustmentType: "none"
    }, {
      id: "3",
      name: "Nome da empresa fictícia",
      document: "00.000.000/0000-00",
      status: "liberado",
      chargeType: "lives",
      lives: 75,
      valuePerLife: 44,
      adjustmentType: "periodic",
      adjustmentPercentage: 5,
      adjustmentPeriod: 12
    }, {
      id: "4",
      name: "Nome da empresa fictícia",
      document: "00.000.000/0000-00",
      status: "liberado",
      chargeType: "fixed",
      fixedValue: 3300,
      adjustmentType: "annual",
      adjustmentPercentage: 8,
      adjustmentMonth: 7
    }, {
      id: "5",
      name: "Nome da empresa fictícia",
      document: "00.000.000/0000-00",
      status: "liberado",
      chargeType: "lives",
      lives: 100,
      valuePerLife: 33,
      adjustmentType: "none"
    }, {
      id: "6",
      name: "Nome da empresa fictícia",
      document: "00.000.000/0000-00",
      status: "liberado",
      chargeType: "fixed",
      fixedValue: 5300,
      adjustmentType: "periodic",
      adjustmentPercentage: 7,
      adjustmentPeriod: 6
    }, {
      id: "7",
      name: "Nome da empresa fictícia",
      document: "00.000.000/0000-00",
      status: "bloqueado",
      chargeType: "fixed",
      fixedValue: 920,
      adjustmentType: "none"
    }];
    setCompanies(dummyData);
    setFilteredCompanies(dummyData);
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCurrentValue = (company: Company): number => {
    if (company.chargeType === "fixed") {
      return company.fixedValue || 0;
    } else {
      return (company.lives || 0) * (company.valuePerLife || 0);
    }
  };

  const getAdjustmentDescription = (company: Company): string => {
    if (company.adjustmentType === "none") return "Sem reajuste";
    if (company.adjustmentType === "annual") {
      const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      return `${company.adjustmentPercentage}% anual em ${months[(company.adjustmentMonth || 1) - 1]}`;
    }
    return `${company.adjustmentPercentage}% a cada ${company.adjustmentPeriod} meses`;
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }
    const filtered = companies.filter(company => {
      const searchLower = searchTerm.toLowerCase();
      return company.name.toLowerCase().includes(searchLower) || company.document.toLowerCase().includes(searchLower);
    });
    setFilteredCompanies(filtered);
    setCurrentPage(1);
  };

  const handleCompanySearch = () => {
    if (!companySearchTerm.trim()) {
      setCompanySearchResults([]);
      return;
    }
    const searchResults = companies.filter(company => {
      const searchLower = companySearchTerm.toLowerCase();
      return (
        (company.name.toLowerCase().includes(searchLower) || 
         company.document.toLowerCase().includes(searchLower)) && 
        !selectedCompanies.includes(company.id)
      );
    });
    setCompanySearchResults(searchResults);
  };

  const addCompanyToSelection = (companyId: string) => {
    if (!selectedCompanies.includes(companyId)) {
      setSelectedCompanies([...selectedCompanies, companyId]);
    }
    setCompanySearchTerm("");
    setCompanySearchResults([]);
  };

  const removeCompanyFromSelection = (companyId: string) => {
    setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      const allIds = filteredCompanies.map(company => company.id);
      setSelectedCompanies(allIds);
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleSelectCompany = (id: string) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter(companyId => companyId !== id));
      setSelectAll(false);
    } else {
      setSelectedCompanies([...selectedCompanies, id]);
      if (selectedCompanies.length + 1 === filteredCompanies.length) {
        setSelectAll(true);
      }
    }
  };

  const selectAllCompanies = () => {
    const allCompanyIds = companies.map(company => company.id);
    setSelectedCompanies(allCompanyIds);
  };

  const openConfigModal = (company: Company) => {
    setCurrentCompany({
      ...company
    });
    setShowConfigModal(true);
  };

  const openMassAdjustmentModal = () => {
    setShowMassAdjustmentModal(true);
  };

  const saveCompanyConfig = () => {
    if (!currentCompany) return;
    setCompanies(companies.map(company => company.id === currentCompany.id ? currentCompany : company));
    setFilteredCompanies(filteredCompanies.map(company => company.id === currentCompany.id ? currentCompany : company));
    setShowConfigModal(false);
  };

  const applyMassAdjustment = () => {
    const updatedCompanies = companies.map(company => {
      if (selectedCompanies.includes(company.id)) {
        return {
          ...company,
          adjustmentType: massAdjustment.adjustmentType,
          adjustmentPercentage: massAdjustment.adjustmentPercentage,
          adjustmentMonth: massAdjustment.adjustmentType === "annual" ? massAdjustment.adjustmentMonth : company.adjustmentMonth,
          adjustmentPeriod: massAdjustment.adjustmentType === "periodic" ? massAdjustment.adjustmentPeriod : company.adjustmentPeriod
        };
      }
      return company;
    });
    setCompanies(updatedCompanies);
    setFilteredCompanies(updatedCompanies.filter(company => filteredCompanies.some(fc => fc.id === company.id)));
    setShowMassAdjustmentModal(false);
    setSelectedCompanies([]);
    setSelectAll(false);
  };

  const updateFixedValue = (companyId: string, value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    setCompanies(companies.map(company => company.id === companyId ? {
      ...company,
      fixedValue: numericValue
    } : company));
    setFilteredCompanies(filteredCompanies.map(company => company.id === companyId ? {
      ...company,
      fixedValue: numericValue
    } : company));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return <div className="mensalidades-container">
      <div className="nav-tabs-container">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link" href="#">Pagamento</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Faturamento</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Valores de Exames</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Valores de Tratamentos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Valores de Documentos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" href="#">Mensalidade</a>
          </li>
        </ul>
      </div>
      
      <div className="content-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="search-container">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Buscar por empresa, CNPJ, CPF..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} />
              <div className="input-group-append">
                <button className="btn btn-primary" type="button" onClick={handleSearch}>
                  <Search size={16} />
                </button>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={openMassAdjustmentModal}>
            Aplicar Reajuste em Massa
          </button>
        </div>
        
        {selectedCompanies.length > 0 && <div className="mb-3">
            <div className="alert alert-info">
              {selectedCompanies.length} empresas selecionadas
            </div>
          </div>}
        
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  </div>
                </th>
                <th>Empresa</th>
                <th>Situação</th>
                <th>Tipo de Cobrança</th>
                <th>Reajuste</th>
                <th>Valor Atual</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(company => <tr key={company.id}>
                  <td>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={selectedCompanies.includes(company.id)} onChange={() => handleSelectCompany(company.id)} />
                    </div>
                  </td>
                  <td>
                    <div>{company.name}</div>
                    <small className="text-muted">{company.document}</small>
                  </td>
                  <td>
                    <div className="status-indicator">
                      {company.status === "liberado" ? <span className="status-liberado">
                          <Check size={16} className="status-icon" />
                          Liberado
                        </span> : <span className="status-bloqueado">
                          <X size={16} className="status-icon" />
                          Bloqueado
                        </span>}
                    </div>
                  </td>
                  <td>{company.chargeType === "lives" ? "Por vidas" : "Valor fixo"}</td>
                  <td>{getAdjustmentDescription(company)}</td>
                  <td>
                    <span>{formatCurrency(getCurrentValue(company))}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openConfigModal(company)}>
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && <nav aria-label="Paginação">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={prevPage}>
                  <ChevronLeft size={16} />
                </button>
              </li>
              
              {Array.from({
            length: totalPages
          }, (_, i) => i + 1).map(number => <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(number)}>
                    {number}
                  </button>
                </li>)}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={nextPage}>
                  <ChevronRight size={16} />
                </button>
              </li>
            </ul>
          </nav>}
      </div>
      
      {/* Config Modal */}
      {showConfigModal && currentCompany && <div className="">
          <div className="modal show " tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Configuração de Mensalidade</h5>
                  <button type="button" className="close" onClick={() => setShowConfigModal(false)}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-12">
                      <h6>{currentCompany.name}</h6>
                      <small className="text-muted">{currentCompany.document}</small>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Tipo de Cobrança</label>
                      <select className="form-control" value={currentCompany.chargeType} onChange={e => setCurrentCompany({
                    ...currentCompany,
                    chargeType: e.target.value as "lives" | "fixed"
                  })}>
                        <option value="lives">Por vidas</option>
                        <option value="fixed">Valor fixo</option>
                      </select>
                    </div>
                  </div>
                  
                  {currentCompany.chargeType === "lives" ? <div className="row mb-3">
                      <div className="col-md-6">
                        <label>Número de vidas</label>
                        <span className="form-control-plaintext">
                          {currentCompany.lives || 0}
                        </span>
                      </div>
                      <div className="col-md-6">
                        <label>Valor por vida (R$)</label>
                        <input type="text" className="form-control currency-input" value={formatCurrency(currentCompany.valuePerLife || 0)} onChange={e => {
                    const value = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
                    setCurrentCompany({
                      ...currentCompany,
                      valuePerLife: parseFloat(value) || 0
                    });
                  }} />
                      </div>
                    </div> : <div className="row mb-3">
                      <div className="col-md-6">
                        <label>Valor fixo (R$)</label>
                        <input type="text" className="form-control currency-input" value={formatCurrency(currentCompany.fixedValue || 0)} onChange={e => {
                    const value = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
                    setCurrentCompany({
                      ...currentCompany,
                      fixedValue: parseFloat(value) || 0
                    });
                  }} />
                      </div>
                    </div>}
                  
                  <hr />
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Tipo de Reajuste</label>
                      <select className="form-control" value={currentCompany.adjustmentType} onChange={e => setCurrentCompany({
                    ...currentCompany,
                    adjustmentType: e.target.value as "none" | "annual" | "periodic"
                  })}>
                        <option value="none">Sem reajuste</option>
                        <option value="annual">Anual (mês específico)</option>
                        <option value="periodic">Periódico (a cada X meses)</option>
                      </select>
                    </div>
                    
                    {currentCompany.adjustmentType !== "none" && <div className="col-md-6">
                        <label>Percentual de Reajuste (%)</label>
                        <input type="number" className="form-control" min="0" step="1" value={currentCompany.adjustmentPercentage || 0} onChange={e => setCurrentCompany({
                    ...currentCompany,
                    adjustmentPercentage: parseFloat(e.target.value) || 0
                  })} />
                      </div>}
                  </div>
                  
                  {currentCompany.adjustmentType === "annual" && <div className="row mb-3">
                      <div className="col-md-6">
                        <label>Mês do Reajuste</label>
                        <select className="form-control" value={currentCompany.adjustmentMonth || 1} onChange={e => setCurrentCompany({
                    ...currentCompany,
                    adjustmentMonth: parseInt(e.target.value)
                  })}>
                          <option value="1">Janeiro</option>
                          <option value="2">Fevereiro</option>
                          <option value="3">Março</option>
                          <option value="4">Abril</option>
                          <option value="5">Maio</option>
                          <option value="6">Junho</option>
                          <option value="7">Julho</option>
                          <option value="8">Agosto</option>
                          <option value="9">Setembro</option>
                          <option value="10">Outubro</option>
                          <option value="11">Novembro</option>
                          <option value="12">Dezembro</option>
                        </select>
                      </div>
                    </div>}
                  
                  {currentCompany.adjustmentType === "periodic" && <div className="row mb-3">
                      <div className="col-md-6">
                        <label>Período (em meses)</label>
                        <input type="number" className="form-control" min="1" value={currentCompany.adjustmentPeriod || 12} onChange={e => setCurrentCompany({
                    ...currentCompany,
                    adjustmentPeriod: parseInt(e.target.value) || 12
                  })} />
                      </div>
                    </div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowConfigModal(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-primary" onClick={saveCompanyConfig}>
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
      
      {/* Mass Adjustment Modal - Updated with improved company selection */}
      {showMassAdjustmentModal && <div>
          <div className="modal show " tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reajuste em Massa</h5>
                  <button type="button" className="close" onClick={() => setShowMassAdjustmentModal(false)}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Empresas Selecionadas ({selectedCompanies.length})</label>
                    
                    <button 
                      className="btn btn-sm btn-outline-primary select-all-btn d-block"
                      onClick={selectAllCompanies}
                    >
                      Selecionar Todas as Empresas
                    </button>
                    
                    <div className="company-selection-area">
                      <div className="selected-companies mb-3">
                        {selectedCompanies.length === 0 ? (
                          <p className="text-muted">Nenhuma empresa selecionada</p>
                        ) : (
                          <ul className="list-group">
                            {selectedCompanies.map(id => {
                              const company = companies.find(c => c.id === id);
                              return (
                                <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                                  <div>
                                    <div>{company?.name}</div>
                                    <small className="text-muted">{company?.document}</small>
                                  </div>
                                  <button 
                                    className="btn btn-sm btn-outline-danger" 
                                    onClick={() => removeCompanyFromSelection(id)}
                                  >
                                    <X size={16} />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                      
                      <div className="company-search mb-3">
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Buscar empresa para adicionar..." 
                            value={companySearchTerm} 
                            onChange={e => setCompanySearchTerm(e.target.value)} 
                            onKeyUp={e => e.key === 'Enter' && handleCompanySearch()}
                          />
                          <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={handleCompanySearch}>
                              <Search size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {companySearchResults.length > 0 && (
                          <div className="search-results mt-2">
                            <ul className="list-group">
                              {companySearchResults.map(company => (
                                <li 
                                  key={company.id} 
                                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                  onClick={() => addCompanyToSelection(company.id)}
                                >
                                  <div>
                                    <div>{company.name}</div>
                                    <small className="text-muted">{company.document}</small>
                                  </div>
                                  <button className="btn btn-sm btn-outline-success">
                                    <Check size={16} />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="form-group">
                    <label>Tipo de Reajuste</label>
                    <select className="form-control" value={massAdjustment.adjustmentType} onChange={e => setMassAdjustment({
                  ...massAdjustment,
                  adjustmentType: e.target.value as "none" | "annual" | "periodic"
                })}>
                      <option value="none">Sem reajuste</option>
                      <option value="annual">Anual (mês específico)</option>
                      <option value="periodic">Periódico (a cada X meses)</option>
                    </select>
                  </div>
                  
                  {massAdjustment.adjustmentType !== "none" && <div className="form-group">
                      <label>Percentual de Reajuste (%)</label>
                      <input type="number" className="form-control" min="0" step="0.1" value={massAdjustment.adjustmentPercentage} onChange={e => setMassAdjustment({
                  ...massAdjustment,
                  adjustmentPercentage: parseFloat(e.target.value) || 0
                })} />
                    </div>}
                  
                  {massAdjustment.adjustmentType === "annual" && <div className="form-group">
                      <label>Mês do Reajuste</label>
                      <select className="form-control" value={massAdjustment.adjustmentMonth} onChange={e => setMassAdjustment({
                  ...massAdjustment,
                  adjustmentMonth: parseInt(e.target.value)
                })}>
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                      </select>
                    </div>}
                  
                  {massAdjustment.adjustmentType === "periodic" && <div className="form-group">
                      <label>Período (em meses)</label>
                      <input type="number" className="form-control" min="1" value={massAdjustment.adjustmentPeriod} onChange={e => setMassAdjustment({
                  ...massAdjustment,
                  adjustmentPeriod: parseInt(e.target.value) || 12
                })} />
                    </div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMassAdjustmentModal(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-primary" onClick={applyMassAdjustment}>
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};

export default Index;
