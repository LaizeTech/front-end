import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, ShoppingBag, Store, ChevronDown } from 'lucide-react';
import './MetricasMensais.css';

const MetricasMensais = () => {
    // Estados para armazenar os dados da API
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [entradasMes, setEntradasMes] = useState({ mes: '', quantidade: 0, valor: 0 });
    const [topProductsData, setTopProductsData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [inactiveProducts, setInactiveProducts] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAllInactive, setShowAllInactive] = useState(false);

    // useEffect para buscar dados quando a plataforma mudar
    useEffect(() => {
        // Função para buscar os dados de uma plataforma específica
        const fetchDataForPlatform = async (platformId) => {
            if (!platformId) return;

            setLoading(true);
            try {
                // Fetch Top 5 Produtos
                const top5Res = await fetch(`http://localhost:8080/produtos/top5?plataforma=${platformId}`);
                if (top5Res.ok) {
                    const data = await top5Res.json();
                    const formattedData = data.map(item => ({ name: item[0], value: item[1] }));
                    setTopProductsData(formattedData);
                } else {
                    setTopProductsData([]);
                }

                // Fetch Receita Mensal
                const receitaRes = await fetch(`http://localhost:8080/produtos/receita/mensal?plataforma=${platformId}`);
                if (receitaRes.ok) {
                    const data = await receitaRes.json();
                    // O backend já retorna o mês e o valor, vamos apenas formatar
                    const formattedData = data.map(item => ({ month: new Date(item[0] + '-02').toLocaleString('default', { month: 'long' }), value: item[1] }));
                    setRevenueData(formattedData);
                    
                    // Calcula a receita total para o card
                    const total = data.reduce((sum, item) => sum + item[1], 0);
                    setTotalRevenue(total);
                } else {
                    setRevenueData([]);
                    setTotalRevenue(0);
                }

                // Fetch Produtos Inativos
                const inativosRes = await fetch(`http://localhost:8080/produtos/inativos?plataforma=${platformId}`);
                if (inativosRes.ok) {
                    const data = await inativosRes.json();
                    const formattedData = data.map(name => ({ name: name, category: name })); // Ajuste se tiver categoria
                    setInactiveProducts(formattedData);
                } else {
                    setInactiveProducts([]);
                }

            } catch (error) {
                console.error("Erro ao buscar dados da plataforma:", error);
            } finally {
                setLoading(false);
            }
        };

        // Função para buscar dados que não dependem da plataforma
        const fetchGeneralData = async () => {
             try {
                const entradasRes = await fetch(`http://localhost:8080/produtos/entradas/mes-atual`);
                if (entradasRes.ok) {
                    const data = await entradasRes.json();
                    if (data.length > 0) {
                        setEntradasMes({
                            mes: data[0][0],
                            quantidade: data[0][1],
                            valor: data[0][2]
                        });
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados de entradas:", error);
            }
        };

        fetchDataForPlatform(selectedPlatform);
        fetchGeneralData();

    }, [selectedPlatform]); // A dependência é a plataforma selecionada

    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
        setShowAllInactive(false); // Reset ao mudar plataforma
    };

    const toggleShowInactive = () => {
        setShowAllInactive(!showAllInactive);
    };
    
    // Função para formatar valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    // Função para formatar labels do eixo Y (cortar texto longo)
    const formatYAxisLabel = (value) => {
        if (value.length > 10) {
            return value.substring(0, 10) + '...';
        }
        return value;
    };

    // Função para limitar produtos inativos exibidos
    const getDisplayedInactiveProducts = () => {
        if (showAllInactive) {
            return inactiveProducts;
        }
        return inactiveProducts.slice(0, 6); // Mostra apenas os primeiros 6
    };

    return (
        <div className="metricas-mensais">
            <div className="page-header">
                <h1 className="page-title">Métricas mensais</h1>
                <button className="add-platform-btn">
                    <Plus size={16} /> Nova plataforma
                </button>
            </div>

            <div className="platform-selector">
                <div className="selector-container">
                    <div className="custom-select-wrapper">
                        <div className="custom-select">
                            <select 
                                className="platform-dropdown" 
                                value={selectedPlatform} 
                                onChange={handlePlatformChange}
                            >
                                <option value="" disabled>Selecione a plataforma</option>
                                <option value="1">Shopee</option>
                                <option value="2">Nuvemshop</option>
                            </select>
                            <div className="select-arrow">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {loading && <p>Carregando métricas...</p>}

            {!loading && selectedPlatform && (
                <div className="metrics-content">
                    {/* Stats Section */}
                    <div className="stats-section">
                        <div className="stat-item">
                            <span className="stat-label">Entradas no mês atual:</span>
                            <span className="stat-value highlight">{entradasMes.mes}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Quantidade de produtos:</span>
                            <span className="stat-value">{entradasMes.quantidade}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Valor investido:</span>
                            <span className="stat-value">{formatCurrency(entradasMes.valor)}</span>
                        </div>
                    </div>

                    {/* Revenue Card */}
                    <div className="revenue-card">
                        <div className="revenue-label">Receita Total (Últimos 6 meses)</div>
                        <div className="revenue-amount">{formatCurrency(totalRevenue)}</div>
                    </div>

                    {/* Inactive Products */}
                    <div className="inactive-section">
                        <div className="section-header">
                            <span className="section-title">Produtos inativos nos últimos 60 dias:</span>
                            {inactiveProducts.length > 6 && (
                                <span className="see-more" onClick={toggleShowInactive}>
                                    {showAllInactive ? 'Ver menos' : 'Ver mais'}
                                </span>
                            )}
                        </div>
                        <div className="inactive-list">
                            {inactiveProducts.length > 0 ? getDisplayedInactiveProducts().map((product, index) => (
                                <div key={index} className="inactive-item">
                                    <span className="product-category">{product.name}</span>
                                </div>
                            )) : <p>Nenhum produto inativo.</p>}
                        </div>
                        {inactiveProducts.length > 6 && !showAllInactive && (
                            <div className="remaining-count">
                                +{inactiveProducts.length - 6} produtos restantes
                            </div>
                        )}
                    </div>

                    {/* Charts Section */}
                    <div className="charts-section">
                        <div className="chart-card">
                            <h3 className="chart-title">Top 5 Produtos mais vendidos</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={topProductsData} layout="vertical" margin={{ top: 10, right: 10, left: 5, bottom: 5 }}>
                                        <XAxis type="number" hide />
                                        <YAxis 
                                            dataKey="name" 
                                            type="category" 
                                            width={120}
                                            tickFormatter={formatYAxisLabel}
                                            interval={0}
                                            tick={{ fontSize: 13 }}
                                        />
                                        <Bar dataKey="value" fill="#e91e63" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        <div className="chart-card">
                            <h3 className="chart-title">Receita Mensal</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart data={revenueData}>
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Line type="monotone" dataKey="value" stroke="#e91e63" strokeWidth={3} dot={{ fill: '#e91e63', strokeWidth: 2, r: 6 }}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
             {!selectedPlatform && <div className="select-platform-prompt">Por favor, selecione uma plataforma para ver as métricas.</div>}
        </div>
    );
};

export default MetricasMensais;