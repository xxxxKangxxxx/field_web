import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useNavigate, useLocation} from 'react-router-dom';
import CategoryButton from '../components/CategoryButton';
import NewsPagination from '../components/News/NewsPagination';
import {NewsApi} from '../lib/Apiservice';
import theme from '../theme';

const NewsMain = styled.section`
  min-height: calc(100vh - 106px - 58px);
  @media screen and (min-width: 1024px) {
    min-height: calc(100vh - 70px - 58px);
  }
`;

const H1 = styled.h1`
  font-size: 1.875rem;
  padding: 2rem 0;
  font-family: 'Goblin one';
  text-align: center;
`;

const ButtonWrapper = styled.div`
  margin: 0 7.5%;
  @media screen and (min-width: 1024px) {
    margin: 0 15%;
  }
`;

const TypeSelect = styled.select`
  margin: 1.25rem 0 0 0;
  color: black;
  appearance: none;
  font-size: 0.75rem;
  font-family: 'SUIT-Regular';
  font-weight: 700;
  background: ${theme.colors.lightgray} url('/down_arrow.png') no-repeat 90% 45% / 16px 16px;
  border-radius: 1rem;
  padding: 0.375rem 0 0.375rem 0.5rem;
  width: ${props => props.width || '5rem'};
  height: 2rem;
  z-index: 0;
  border: none;
`;

const Option = styled.option`
  color: black;
  appearance: none;
  font-family: 'SUIT-Regular';
  font-weight: 900;
  font-size: 0.75rem;
`;

const DropdownWrapper = styled.div`
  padding: 0 7.5%;
  display: flex;
  gap: 0.5rem;
  justify-content: end;
  @media screen and (min-width: 1024px) {
    padding: 0 15%;
  }
`;

export default function NewsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryArr = ['월간필드', '취업/진로', '공모전', '공지'];
  const [selectCategory, setSelectCategory] = useState('월간필드');
  const [loading, setLoading] = useState(false);
  const [newsYear, setNewsYear] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [newsMonth, setNewsMonth] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('선택하지않음');
  const [selectedMonth, setSelectedMonth] = useState('선택하지않음');

  const handleYearChange = e => {
    navigate(`?category=월간필드&year=${e.target.value}`);
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = e => {
    navigate(`?category=월간필드&year=${selectedYear}&month=${e.target.value}`);
    setSelectedMonth(e.target.value);
  };

  const yearFilter = (data, filterYear) => {
    setSelectedYear(filterYear);
    let monthByYear;
    if (filterYear === '선택하지않음') {
      setRenderData(data);
      monthByYear = [...new Set(data.map(item => item.month))];
    } else {
      const yearFilterData = data.filter(item => item.year === parseInt(filterYear, 10));
      monthByYear = [...new Set(yearFilterData.map(item => item.month))];
      setRenderData(yearFilterData);
    }
    monthByYear = [...monthByYear].sort((a, b) => a - b);
    setSelectedMonth('선택하지않음');
    setNewsMonth(monthByYear);
  };

  const monthFilter = (data, filterYear, filterMonth) => {
    setSelectedMonth(filterMonth);
    let monthFilteredData;
    if (filterMonth === '선택하지않음') {
      monthFilteredData = data.filter(item =>
        filterYear === '선택하지않음' ? item : item.year === parseInt(filterYear, 10),
      );
    } else {
      monthFilteredData = data.filter(
        item =>
          item.month === parseInt(filterMonth, 10) &&
          (filterYear === '선택하지않음' ? true : item.year === parseInt(filterYear, 10)),
      );
    }
    setRenderData(monthFilteredData);
  };

  const handleButtonClick = item => {
    setSelectCategory(item);
    if (item === '월간필드') {
      navigate(`/news?category=월간필드&year=선택하지않음&month=선택하지않음`);
    } else {
      navigate(`/news?category=${item}`);
    }
  };

  const initialYearMonth = response => {
    const uniqueYears = [
      ...new Set(response.map(item => item.year).filter(year => year !== 0)),
    ].sort((a, b) => b - a);
    const uniqueMonths = [
      ...new Set(response.map(item => item.month).filter(month => month !== 0)),
    ].sort((a, b) => a - b);
    setNewsYear(uniqueYears);
    setNewsMonth(uniqueMonths);
  };

  const getDataNews = async category => {
    try {
      setLoading(true);
      const now = new Date();
      const lastUpdate = localStorage.getItem(`${category}-lastUpdate`);
      const lastUpdateTime = lastUpdate ? new Date(parseInt(lastUpdate, 10)) : null;
      const categoryData = localStorage.getItem(`${category}`);
      let response;
      if (
        !categoryData ||
        categoryData === '[]' ||
        !lastUpdateTime ||
        now - lastUpdateTime > 12 * 60 * 60 * 1000
      ) {
        response = await NewsApi(category);
        localStorage.setItem(`${category}`, JSON.stringify(response));
        localStorage.setItem(`${category}-lastUpdate`, now.getTime().toString());
      } else {
        response = categoryData ? JSON.parse(categoryData) : [];
      }
      setNewsData(response);
      if (category === '월간필드') {
        initialYearMonth(response);
        const urlYear = new URLSearchParams(location.search).get('year') || '선택하지않음';
        const urlMonth = new URLSearchParams(location.search).get('month') || '선택하지않음';
        yearFilter(response, urlYear);
        monthFilter(response, urlYear, urlMonth);
      }
      setLoading(false);
    } catch (error) {
      // 에러 처리
    }
  };

  useEffect(() => {
    setLoading(true);
    const urlCategory = new URLSearchParams(location.search).get('category') || '월간필드';
    getDataNews(urlCategory);
    setSelectCategory(urlCategory);
    setLoading(false);
  }, [location.search]);

  return (
    <NewsMain>
      <H1>NEWS</H1>
      <ButtonWrapper>
        {categoryArr.map(category => (
          <CategoryButton
            key={category}
            label={category}
            isActive={selectCategory === category}
            onClick={() => handleButtonClick(category)}
          />
        ))}
      </ButtonWrapper>
      {selectCategory === '월간필드' && (
        <DropdownWrapper>
          <TypeSelect
            value={selectedYear}
            name='Type'
            autoComplete='off'
            onChange={handleYearChange}
          >
            <Option value='선택하지않음'>년도</Option>
            {newsYear.map(item => (
              <Option value={item} key={item}>
                {item}년
              </Option>
            ))}
          </TypeSelect>
          <TypeSelect
            value={selectedMonth}
            name='Type'
            autoComplete='off'
            width='3rem'
            onChange={handleMonthChange}
          >
            <Option value='선택하지않음'>월</Option>
            {newsMonth.map(item => (
              <Option value={item} key={item}>
                {item}월
              </Option>
            ))}
          </TypeSelect>
        </DropdownWrapper>
      )}
      <NewsPagination
        newsData={selectCategory === '월간필드' ? renderData : newsData}
        category={selectCategory}
        loading={loading}
      />
    </NewsMain>
  );
}
