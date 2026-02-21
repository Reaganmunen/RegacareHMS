import { ActionDialog } from '@/components/action-dialog';
import { ViewAction } from '@/components/action-options';
import { DoctorForm } from '@/components/form/doctor-form';
import { StaffForm } from '@/components/form/staff-form';
import Pagination from '@/components/pagination';
import SearchInput from '@/components/search-input';
import { Table } from '@/components/tables/table';
import { Button } from '@/components/ui/button';
import { ProfileImage } from '@/components/ui/profile-image';
import { SearchParamsProps } from '@/types';
import { checkRole } from '@/utils/roles';
import { getAllDoctors } from '@/utils/services/doctor';
import { getAllStaff } from '@/utils/services/staffs';
import { DATA_LIMIT } from '@/utils/settings';
import { Doctor, Staff } from '@prisma/client';
import { format } from 'date-fns';
import { Users } from 'lucide-react';
import React from 'react'

const columns =[
  {
    header: "Info",
    key: "name",
  },
  {
    header:"Role",
    key:"role",
    className:"hidden md:table-cell"
  },
  {
    header:"Phone",
    key:"contact",
    className:"hidden md:table-cell"
  },
  {
    header:"Email",
    key:"email",
    className: "hidden lg:table-cell"
  },
  {
    header:"Joined Date",
    key:"created_at",
    className:"hidden lg:table-cell"
  },
  {
    header:"Actions",
    key:"actions",
  }
];

const StaffList = async(props:SearchParamsProps) => {
  const searchParams = await props.searchParams;
const page = (searchParams?.p || "1") as string;
const searchQuery = (searchParams?.q || "") as string;


const {data, totalPages, totalRecords, currentPage} = await getAllStaff({
  page,
  search: searchQuery,
});

if (!data) return null;
const isAdmin = await checkRole("Admin")

const renderRow=(item: Staff)=>
  <tr
  key={item?.id}
  
  className="border-b border-gray-200 even:bg-slate-50 text-base hover:bg-slate-50">
    <td className="flex items-center gap-4 p-4">
      <ProfileImage url={item?.img!}
      name={item?.name}  colorCode={item?.colorCode!}
      textClassName="text-black"/>
      <div>
        <h3 className="uppercase">{item?.name}</h3>
        <span className="text-sm capitalize">{item?.phone}</span>
      </div>


    </td>
    <td className="hidden md:table-cell">{item?.role}</td>
    <td className="hidden md:table-cell">{item?.phone}</td>
    <td className="hidden lg:table-cell">{item?.email}</td>
    <td className="hidden xl:table-cell">{format(item?.created_at, "yyyy-MM-dd")}</td>
    <td>
      <div className="flex items-center gap-2">
        <ActionDialog type="staff" id={item?.id} data={item}/>
       {isAdmin && <ActionDialog type="delete" deleteType="staff" id={item?.id} />}


      </div>

    </td>

  </tr>




  return (
    <div className="bg-white rounded-xl py-6 px-3 2xl:px-6">
      <div className="flex items-center justify-between">
         <div className="hidden lg:flex items-center gap-1">
             <Users size={20} className="text-gray-500"/>
             <p className="text-2xl font-semibold">{totalRecords}</p>
             <span className="text-gray-600 text-sm xl:text-base">
               Total Staff 
             </span>
         </div>
         <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />
        {isAdmin && <StaffForm />}
         </div>
      </div>
      <div className="mt-4">
        <Table  columns={columns} data={data} renderRow={renderRow} />

        {
          totalPages &&(<Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          totalRecords={totalRecords}
          limit={DATA_LIMIT}/>
      ) 

        }
      </div>
      </div>
    
  )
}

export default StaffList