'use client';

import React, { useEffect, useMemo, useState } from 'react'
import { DatePicker, Input, Select, Tabs, TabsProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation';
import moment from 'moment';
import dayjs from 'dayjs';

import * as API from '@/api';
import styles from './page.module.scss'
import Status from '@/components/status';
import Typography from '@/components/typography';
import Table, { TColumn } from '@/components/table'
import { TBreadCrumb, TFilterOptions, TGovernanceDetail, TGovernanceTimetable } from '@/models';
import { useBreadcrumbs, useSelectedAccountCompany } from '@/hooks';
import { createRouteForGovernance, setBreadCrumbsForGovernance } from '@/utils/governance';
import ScollablePage from '@/components/scollable-page';
import Space from '@/components/space';
import Container from '@/components/container';
import FlexBox from '@/components/flex-box';
import Button from '@/components/button';
import Misc from '@/utils/misc';
import { SORT_OPTIONS } from '@/constants';
import useAmplitudeContext from '@/hooks/amplitude';
import Clickable from '@/components/clickable';
import Icon from '@/components/icon';

const SEARCH_OPTIONS = [{
  label: "Name",
  value: "itemToReview",
}, {
  label: "Status",
  value: "status",
}, {
  label: "Group",
  value: "group",
}]

const GROUP_OPTIONS = [
  {
    label: "Meeting Minutes",
    value: "Meeting Minutes",
  },
  {
    label: "Vision and Mission",
    value: "Vision and Mission",
  },
  {
    label: "Objective",
    value: "Objective",
  },
  {
    label: "Action",
    value: "Action",
  },
  {
    label: "Register Document",
    value: "Register Document",
  },
  {
    label: "Record Document",
    value: "Record Document",
  },
  {
    label: "Risk",
    value: "Risk",
  },
  {
    label: "Company Review Date",
    value: "Company Review Date",
  },
  {
    label: "Company Annual Review Date",
    value: "Company Annual Review Date",
  },
  {
    label: "Purpose",
    value: "Purpose",
  },
  {
    label: "Resolutions",
    value: "Resolutions",
  },
  {
    label: "Contracts",
    value: "Contracts",
  },
  {
    label: "Policies and Procedures",
    value: "Policies and Procedures",
  },
  {
    label: "Complaints",
    value: "Complaints",
  },
  {
    label: "Insurances",
    value: "Insurances",
  },
  {
    label: "Approved Suppliers and Advisers",
    value: "Approved Suppliers and Advisers",
  },
  {
    label: "Conflicts",
    value: "Conflicts",
  },
  {
    label: "Incident",
    value: "Incident",
  },
  {
    label: "Governing Documents",
    value: "Governing Documents",
  },
  {
    label: "Business Planning",
    value: "Business Planning",
  },
  {
    label: "Regulation & Compliance",
    value: "Regulation & Compliance",
  },
  {
    label: "Deal Bibles",
    value: "Deal Bibles",
  },
  {
    label: "Finance Document",
    value: "Finance Document",
  },
  {
    label: "Real Estate",
    value: "Real Estate",
  },
  {
    label: "HR & Personnel",
    value: "HR & Personnel",
  },
  {
    label: "Products & Services",
    value: "Products & Services",
  },
  {
    label: "Other",
    value: "Other",
  },

]

const STATUS_OPTIONS = [{
  label: "Overdue",
  value: "Overdue"
},
{
  label: "Archive",
  value: "Archive"
},
{
  label: "Review due",
  value: "Review due"
},
{
  label: "Up to date",
  value: "Up to date"
},
{
  label: "Current",
  value: "Current"
},
{
  label: "Missing",
  value: "Missing"
},
]

const Page = () => {

  const [governances, setGovernances] = useState<TGovernanceTimetable>({
    all: [],
    complianceTimetable: [],
    riskAndObjectives: []
  });
  const [initing, setIniting] = useState(true);
  const [typeSearch, setTypeSearch] = useState<string>("itemToReview")
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [tabId, setTabId] = useState("current");
  const [filtersToApply, setFiltersToApply] = useState<TFilterOptions>({})

  const companyId = useSelectedAccountCompany()?.companyId;
  const router = useRouter();
  const breadcrumbs = useBreadcrumbs()

  const { trackAmplitudeEvent } = useAmplitudeContext();

  useEffect(() => {
    trackAmplitudeEvent(
      "Viewed Governance Timetable",
      {
        page: "Governance Timetable page",
      }
    );
  }, []);

  const getGovernanceData = (async () => {
    if (!companyId) {
      return
    }
    setIniting(true);
    try {
      const response = await API.getGovernanceData({ companyId });
      setGovernances(response);
    } finally {
      setIniting(false);
    }
  })

  useEffect(() => { getGovernanceData() }, [companyId])

  const governanceTimetableColumns = useMemo<TColumn<TGovernanceDetail>[]>(
    () => [
      {
        key: 'itemToReview',
        title: 'Item To Review',
        width: 380,
        render: (record) => (
          <Typography size='large' primary ellipsis>
            {record.itemToReview}
          </Typography>
        ),
      },
      {
        key: 'reviewDate',
        title: 'Review Date',
        width: 250,
        render: (record) => moment(record.reviewDate).format('DD/MM/YYYY'),
      },
      {
        key: 'group',
        title: 'Group',
        width: 250,
      },
      {
        key: 'status',
        title: 'Status',
        width: 180,
        justifyContent: "center",
        render: (record) => (
          <Status
            className={styles.statusWidth}
            title={record.status}
            color={
              record.status === 'Overdue'
                ? 'red'
                : record.status === 'Review due'
                  ? 'yellow'
                  : 'green'
            }
          />
        ),
      },
    ],
    []
  );

  const onClickGovernance = (record: TGovernanceDetail) => {
    const link: any = createRouteForGovernance(record);
    const breadcrumbsArray: TBreadCrumb[] = setBreadCrumbsForGovernance(record)
    breadcrumbs.set(breadcrumbsArray)
    router.push(link);

    trackAmplitudeEvent(
      "Governance Timetable Item - Clicked - " + record?.group,
      {
        page: "Governance Timetable page",
      }

    );
  };

  const parsedData = useMemo(() => {
    let items = []
    if (tabId === "all") {
      items = governances?.all
    } else if (tabId === "riskAndObjectives") {
      items = governances?.riskAndObjectives
    } else {
      items = governances?.complianceTimetable
    }
    const filteredData = Misc.getFilteredData(items, search, SORT_OPTIONS.RECENTLY, typeSearch, "", filtersToApply) || [];
    return filteredData
  }, [governances, search, typeSearch, filtersToApply]);


  const onChange = (key: string) => {
    setFiltersToApply({})
    setSearch("")
    if (key === "complianceData") {
      setTabId("complianceData");
    } else if (key === "riskAndObjectives") {
      setTabId("riskAndObjectives");
    } else if (key === "all") {
      setTabId("all");
    }
  };

  const clearFilters = () => {
    setFiltersToApply({
    });
    getGovernanceData();
  };

  const handleFilter = () => {
    setFilter((prev) => !prev);
    clearFilters()
  };

  const TABS: TabsProps["items"] = [
    {
      key: "complianceData",
      label: "Compliance timetable",
      children: (
        <Table
          title="Compliance timetable"
          className="riskMeetingTable"
          columns={governanceTimetableColumns}
          items={parsedData}
          loading={initing}
          onRowClick={(record) => onClickGovernance(record)}
          noDataProps={{
            title: "There are no records...",
          }}
          headerRight={
            <>
              <FlexBox alignItems='center'>
                <Clickable
                  className={`${styles.filterIcon} ${filter ? styles.filterActive : ""
                  }`}
                  onClick={() => {
                    handleFilter();
                  }}
                >
                  <Icon name="filterIcon" className={styles.filterIconSize} />
                </Clickable>
                <Space horizontal size={24} />
                <Input
                  allowClear
                  className={styles.searchInput}
                  bordered
                  size="large"
                  placeholder="Type to search..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
                <Space horizontal size={35} />
                <Typography gray>Search by:</Typography>
                <Space horizontal size={16} />
                <Select
                  className={styles.sortSelect}
                  size="large"
                  bordered
                  placeholder="Select"
                  defaultValue={SEARCH_OPTIONS[0]?.value}
                  value={typeSearch}
                  onChange={(value) => setTypeSearch(value)}
                  options={SEARCH_OPTIONS}
                />

              </FlexBox>
            </>
          }
          headerBottom={
            filter && (
              <FlexBox alignItems="center">
                <Space horizontal size={62} />

                <FlexBox flex={1} gap={10}>
                  <Select
                    size='large'
                    placeholder='Group Type'
                    options={GROUP_OPTIONS}
                    value={filtersToApply?.group}
                    onChange={(value) =>
                      setFiltersToApply({ ...filtersToApply, group: value })
                    }
                    allowClear
                  />
                  <Select
                    size='large'
                    placeholder='Status Type'
                    options={STATUS_OPTIONS}
                    value={filtersToApply?.status}
                    onChange={(value) =>
                      setFiltersToApply({ ...filtersToApply, status: value })
                    }
                    allowClear
                  />
                  <DatePicker.RangePicker
                    size="large"
                    format="DD/MM/YYYY"
                    value={filtersToApply?.date ? [dayjs(filtersToApply?.date?.from), dayjs(filtersToApply?.date?.to)] : undefined}
                    onChange={(value) =>
                      setFiltersToApply({
                        ...filtersToApply, date: value ? {
                          from: value?.[0]?.toISOString() || moment().toISOString(),
                          to: value?.[1]?.toISOString() || moment().toISOString()
                        } : undefined
                      })
                    }
                    allowClear
                  />
                  <Button
                    onClick={() => {
                      clearFilters();
                    }}
                  >
                    Clear
                  </Button>
                </FlexBox>
              </FlexBox>
            )
          }
        />
      ),
    },
    {
      key: "riskAndObjectives",
      label: "Risks and objectives for review",
      children: (
        <Table
          title="Risks and objectives for review"
          className="riskMeetingTable"
          columns={governanceTimetableColumns}
          items={parsedData}
          loading={initing}
          onRowClick={(record) => onClickGovernance(record)}
          noDataProps={{
            title: "There are no records...",
          }}
          headerRight={
            <>
              <FlexBox alignItems='center'>
                <Clickable
                  className={`${styles.filterIcon} ${filter ? styles.filterActive : ""
                  }`}
                  onClick={() => {
                    handleFilter();
                  }}
                >
                  <Icon name="filterIcon" className={styles.filterIconSize} />
                </Clickable>
                <Space horizontal size={24} />
                <Input
                  allowClear
                  className={styles.searchInput}
                  bordered
                  size="large"
                  placeholder="Type to search..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
                <Space horizontal size={35} />
                <Typography gray>Search by:</Typography>
                <Space horizontal size={16} />
                <Select
                  className={styles.sortSelect}
                  size="large"
                  bordered
                  placeholder="Select"
                  defaultValue={SEARCH_OPTIONS[0]?.value}
                  value={typeSearch}
                  onChange={(value) => setTypeSearch(value)}
                  options={SEARCH_OPTIONS}
                />

              </FlexBox>
            </>
          }
          headerBottom={
            filter && (
              <FlexBox alignItems="center">
                <Space horizontal size={62} />

                <FlexBox flex={1} gap={10}>
                  <Select
                    size='large'
                    placeholder='Group Type'
                    options={GROUP_OPTIONS}
                    value={filtersToApply?.group}
                    onChange={(value) =>
                      setFiltersToApply({ ...filtersToApply, group: value })
                    }
                    allowClear
                  />
                  <Select
                    size='large'
                    placeholder='Status Type'
                    options={STATUS_OPTIONS}
                    value={filtersToApply?.status}
                    onChange={(value) =>
                      setFiltersToApply({ ...filtersToApply, status: value })
                    }
                    allowClear
                  />
                  <DatePicker.RangePicker
                    size="large"
                    format="DD/MM/YYYY"
                    value={filtersToApply?.date ? [dayjs(filtersToApply?.date?.from), dayjs(filtersToApply?.date?.to)] : undefined}
                    onChange={(value) =>
                      setFiltersToApply({
                        ...filtersToApply, date: value ? {
                          from: value?.[0]?.toISOString() || moment().toISOString(),
                          to: value?.[1]?.toISOString() || moment().toISOString()
                        } : undefined
                      })
                    }
                    allowClear
                  />
                  <Button
                    onClick={() => {
                      clearFilters();
                    }}
                  >
                    Clear
                  </Button>
                </FlexBox>
              </FlexBox>
            )
          }
        />
      ),
    },
    {
      key: "all",
      label: "All",
      children: (
        <Table
          className="riskMeetingTable"
          title='Governance Timetable'
          columns={governanceTimetableColumns}
          items={parsedData}
          loading={initing}
          onRowClick={(record) => onClickGovernance(record)}
          noDataProps={{
            title: "There are no records...",
          }}
          headerRight={
            <>
              <FlexBox alignItems='center'>
                <Clickable
                  className={`${styles.filterIcon} ${filter ? styles.filterActive : ""
                  }`}
                  onClick={() => {
                    handleFilter();
                  }}
                >
                  <Icon name="filterIcon" className={styles.filterIconSize} />
                </Clickable>
                <Space horizontal size={24} />
                <Input
                  allowClear
                  className={styles.searchInput}
                  bordered
                  size="large"
                  placeholder="Type to search..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
                <Space horizontal size={35} />
                <Typography gray>Search by:</Typography>
                <Space horizontal size={16} />
                <Select
                  className={styles.sortSelect}
                  size="large"
                  bordered
                  placeholder="Select"
                  defaultValue={SEARCH_OPTIONS[0]?.value}
                  value={typeSearch}
                  onChange={(value) => setTypeSearch(value)}
                  options={SEARCH_OPTIONS}
                />

              </FlexBox>
            </>
          }
          headerBottom={
            filter && (
              <FlexBox alignItems="center">
                <Space horizontal size={62} />

                <FlexBox flex={1} gap={10}>
                  <Select
                    size='large'
                    placeholder='Group Type'
                    options={GROUP_OPTIONS}
                    value={filtersToApply?.group}
                    onChange={(value) =>
                      setFiltersToApply({ ...filtersToApply, group: value })
                    }
                    allowClear
                  />
                  <Select
                    size='large'
                    placeholder='Status Type'
                    options={STATUS_OPTIONS}
                    value={filtersToApply?.status}
                    onChange={(value) =>
                      setFiltersToApply({ ...filtersToApply, status: value })
                    }
                    allowClear
                  />
                  <DatePicker.RangePicker
                    size="large"
                    format="DD/MM/YYYY"
                    value={filtersToApply?.date ? [dayjs(filtersToApply?.date?.from), dayjs(filtersToApply?.date?.to)] : undefined}
                    onChange={(value) =>
                      setFiltersToApply({
                        ...filtersToApply, date: value ? {
                          from: value?.[0]?.toISOString() || moment().toISOString(),
                          to: value?.[1]?.toISOString() || moment().toISOString()
                        } : undefined
                      })
                    }
                  />
                  <Button
                    onClick={() => {
                      clearFilters();
                    }}
                  >
                    Clear
                  </Button>
                </FlexBox>
              </FlexBox>
            )
          }
        />
      ),
    },
  ];

  return (
    <ScollablePage >
      <Space size={32} />
      <Container>
        <Space size={32} />
        <Tabs
          defaultActiveKey={tabId}
          items={TABS}
          onChange={onChange}
          type="card"
          className='meeting_table'
        />
        <Space size={25} />
        <Space size={24} />
      </Container>
    </ScollablePage>
  )
}

export default Page;