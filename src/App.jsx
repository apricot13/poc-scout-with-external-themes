/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import useQuery from "./hooks/useQuery"
import useFathom from "./hooks/useFathom"
import { fetchResultsByQuery } from "./lib/api"
import { onlyOptions } from "./data/_config"
import {
  collectionOptions,
  subcategoriesOf,
  sendOptions,
  accessibilityOptions,
  daysOptions,
  suitabilityOptions,
} from "./lib/transform-taxonomies"

import Layout, {
  ResultsHeader,
  ResultsList,
  Count,
  NoResults,
} from "./components/Layout"

import { orderFilters } from "./lib/order-filters"

import Switch from "./components/Switch"
import SearchBar from "./components/SearchBar"
import ServiceCard from "./components/ServiceCard"
import Skeleton from "./components/ServiceCard/Skeleton"
import Filters from "./components/Filters"
import Filter from "./components/Filter"
import RadioFilter from "./components/Filter/RadioFilter"
import KeywordFilter from "./components/Filter/KeywordFilter"
import AgeFilter from "./components/Filter/AgeFilter"
import ListMap from "./components/ListMap"
import ListMapStatic from "./components/ListMapStatic"
import Pagination from "./components/Pagination"
import PinboardLink from "./components/PinboardLink"
import { theme } from "./themes/theme_generator"
import ClearFilters from "./components/ClearFilters"
import { checkCookiesAccepted } from "./lib/cookies"
import AlertStatic from "./components/AlertStatic"

const App = ({ children, location, navigate }) => {
  const scrollTarget = useRef(null)

  const [keywords, setKeywords] = useQuery("keywords", "")

  const [coverage, setCoverage] = useQuery("location", "")
  const [lat, setLat] = useQuery("lat", "")
  const [lng, setLng] = useQuery("lng", "")

  const [collection, setCollection] = useQuery("collection", false)

  const [categories, setCategories] = useQuery("categories", [], {
    array: true,
  })
  const [ages, setAges] = useQuery("ages", [], { array: true })
  const [needs, setNeeds] = useQuery("needs", [], { array: true })
  const [accessibilities, setAccessibilities] = useQuery(
    "accessibilities",
    [],
    {
      array: true,
    }
  )
  const [suitabilities, setSuitabilities] = useQuery("suitabilities", [], {
    array: true,
  })
  const [days, setDays] = useQuery("days", [], { array: true })
  const [minAge, setMinAge] = useQuery("min_age", false, { numerical: true })
  const [maxAge, setMaxAge] = useQuery("max_age", false, { numerical: true })
  const [only, setOnly] = useQuery("only", [], { array: true })

  const [mapVisible, setMapVisible] = useQuery("map", false, { boolean: true })

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useQuery("page", 1, { numerical: true })
  const [totalPages, setTotalPages] = useState(false)

  useFathom()

  useEffect(() => {
    setLoading(true)
    fetchResultsByQuery(location.search).then(data => {
      setResults(data.content)
      setTotalPages(data.totalPages)
      setLoading(false)
    })
  }, [location.search])

  const filterSendNeeds = sendOptions.length > 0 && (
    <Filter
      key="sendNeeds"
      legend="SEND needs"
      options={sendOptions}
      selection={needs}
      setSelection={setNeeds}
      setPage={setPage}
      foldable
    />
  )

  const filterAges = (
    <AgeFilter
      key="ages"
      legend="Ages"
      maxAge={maxAge}
      setMaxAge={setMaxAge}
      minAge={minAge}
      setMinAge={setMinAge}
      setPage={setPage}
      foldable
    />
  )

  const filterAccessibilities = accessibilityOptions.length > 0 && (
    <Filter
      key="accessibilities"
      legend="Access needs"
      options={accessibilityOptions}
      selection={accessibilities}
      setSelection={setAccessibilities}
      setPage={setPage}
      foldable
    />
  )

  const filterOnlyShow = onlyOptions.length > 0 && (
    <Filter
      key="onlyShow"
      legend="Only show"
      options={onlyOptions}
      selection={only}
      setSelection={setOnly}
      setPage={setPage}
      foldable
    />
  )

  const filterDays = daysOptions.length > 0 && (
    <Filter
      key="days"
      legend="Days"
      options={daysOptions}
      selection={days}
      setSelection={setDays}
      setPage={setPage}
      foldable
    />
  )

  const filterSuitabilities = suitabilityOptions.length > 0 && (
    <Filter
      key="suitabilities"
      legend="Suitable for"
      options={suitabilityOptions}
      selection={suitabilities}
      setSelection={setSuitabilities}
      setPage={setPage}
      foldable
    />
  )

  const filters = {
    sendNeeds: {
      component: filterSendNeeds,
      clear: [setNeeds],
      clearValue: [[]],
    },
    ages: {
      component: filterAges,
      clear: [setMinAge, setMaxAge],
      clearValue: [false, false],
    },
    accessibilities: {
      component: filterAccessibilities,
      clear: [setAccessibilities],
      clearValue: [[]],
    },
    onlyShow: {
      component: filterOnlyShow,
      clear: [setOnly],
      clearValue: [[]],
    },
    days: {
      component: filterDays,
      clear: [setDays],
      clearValue: [[]],
    },
    suitabilities: {
      component: filterSuitabilities,
      clear: [setSuitabilities],
      clearValue: [[]],
    },
  }

  return (
    <>
      <Helmet>
        <title>
          {page > 1 ? `Page ${page} ` : `${theme.tagline} `}| {theme.title} |{" "}
          {theme.organisation}
        </title>
      </Helmet>
      <Layout
        scrollRef={scrollTarget}
        headerComponents={
          <SearchBar
            keywords={keywords}
            setKeywords={setKeywords}
            coverage={coverage}
            setCoverage={setCoverage}
            setLat={setLat}
            setLng={setLng}
            setPage={setPage}
          />
        }
        sidebarComponents={
          <>
            <Filters>
              <RadioFilter
                name="collection"
                options={collectionOptions}
                selection={collection}
                setSelection={setCollection}
                clearThis={setCategories}
                setPage={setPage}
              />
              {subcategoriesOf(collection).length > 0 && (
                <Filter
                  legend="Categories"
                  options={subcategoriesOf(collection)}
                  selection={categories}
                  setSelection={setCategories}
                  setPage={setPage}
                  foldable
                />
              )}
              {orderFilters(filters, theme.filterOrder)}
              <ClearFilters
                setPage={setPage}
                filters={filters}
                clearCategory={setCollection}
                clearSubCategory={setCategories}
              />
            </Filters>
          </>
        }
        mainContentComponents={
          <MainContent
            loading={loading}
            results={results}
            keywords={keywords}
            coverage={coverage}
            mapVisible={mapVisible}
            setMapVisible={setMapVisible}
            navigate={navigate}
            location={location}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            scrollTarget={scrollTarget}
          />
        }
      />
      {children}
    </>
  )
}

const MainContent = ({
  loading,
  results,
  keywords,
  coverage,
  mapVisible,
  setMapVisible,
  navigate,
  location,
  totalPages,
  page,
  setPage,
  scrollTarget,
}) => {
  const cookiesAccepted = checkCookiesAccepted()
  // still loading
  if (loading)
    return (
      <>
        <ResultsHeader>
          <Count />
          <Switch
            id="map-toggle"
            checked={mapVisible}
            onChange={e => setMapVisible(e.target.checked)}
            label="Show map?"
          />
        </ResultsHeader>
        <ResultsList aria-live="polite">
          <Skeleton />
        </ResultsList>
      </>
    )

  // not loading and no results
  if (!results)
    return (
      <NoResults>
        There was a problem fetching results. Please try again later.
      </NoResults>
    )

  // not loading, results exists but is empty array
  if (results.length === 0)
    return <NoResults>No results to show. Try widening your search.</NoResults>

  // not loading, results exist and has length that is not 0
  return (
    <>
      <ResultsHeader>
        <Count>
          {(keywords || coverage) && (
            <>
              Showing results{" "}
              {keywords && (
                <>
                  for <strong>{keywords}</strong>
                </>
              )}{" "}
              {coverage && (
                <>
                  near <strong>{coverage}</strong>
                </>
              )}
            </>
          )}
        </Count>
        <Switch
          id="map-toggle"
          checked={mapVisible}
          onChange={e => setMapVisible(e.target.checked)}
          label="Show map?"
        />
      </ResultsHeader>
      {mapVisible &&
        (cookiesAccepted ? (
          <ListMap results={results} navigate={navigate} location={location} />
        ) : (
          <>
            <AlertStatic>{theme.cookiesDisabledMessage}</AlertStatic>
            <ListMapStatic results={results} />
          </>
        ))}
      <PinboardLink location={location} />
      <ResultsList aria-live="polite">
        {results?.map(s => (
          <ServiceCard key={s.id} {...s} />
        ))}
      </ResultsList>
      <Pagination
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        scrollTarget={scrollTarget}
      />
    </>
  )
}

export default App
