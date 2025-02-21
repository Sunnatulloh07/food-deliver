import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FoodsDataType } from "@/configs/types";
import { Loader2, Trash } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_FOOD } from "@/graphql/actions/delete.food.action";
import toast from "react-hot-toast";
import { GET_ALL_FOODS } from "@/graphql/actions/get.foods.action";
import Loader from '@/components/shared/layout/loader'

function FoodsData() {
  const [deleteFoodMutation] = useMutation(DELETE_FOOD);
  const { refetch, data: foods, loading } = useQuery(GET_ALL_FOODS);
  const [deleteImageLoading, setDeleteImageLoading] = useState<boolean>(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDeleteImage = async (id: string, images: string[]) => {
    setDeleteImageLoading(true);
    try {
      const { data } = await deleteFoodMutation({
        variables: {
          id,
        },
      });
      await handleDeleteStorage(images);
      toast.success(data?.deleteFoodById.message);
      refetch();
      setDeleteImageLoading(false);
    } catch (error) {
      toast.error((error as Error).message);
      setDeleteImageLoading(false);
    }
  };

  const handleDeleteStorage = async (url: string[]) => {
    return await fetch("/api/file-delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: url }),
    });
  };

  const columns: GridColDef<FoodsDataType>[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.6 },
    { field: "price", type: "number", headerName: "Price", flex: 0.4 },
    {
      field: "totalOrders",
      type: "number",
      headerName: "Total Orders",
      flex: 0.4,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.8,
      valueGetter: (value: Date) => {
        const date = value ? new Date(value) : null;
        return date?.toLocaleDateString("en-US");
      },
    },
    {
      field: " ",
      headerName: "Action",
      flex: 0.5,
      renderCell: ({ row }: { row: FoodsDataType }) => {
        return (
          <div className=" flex justify-center items-center ">
            <span
              className="py-3"
              
              onClick={() => handleDeleteImage(row.id, row.images)}
            >
             {deleteImageLoading ?  <Loader2 className="animate-spin text-red-500" /> : <Trash className="cursor-pointer text-red-500" />}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {(loading || deleteImageLoading) ? <Loader /> : (
      <Box
        m={"40px 0 0 0"}
        overflow={"hidden"}
        sx={{
          "& .MuiDataGrid-root": {
            height: "85vh",
          },
          "& .MuiDataGrid-row": {
            color: "#fff",
            borderBottom: "1px solid #ffffff30!important",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none!important",
          },
          "& .name-column--cell": {
            color: "#fff",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#1F2A40",
          },
          "& .MuiDataGrid-footerContainer": {
            color: "#fff",
            borderTop: "none",
            backgroundColor: "#3e4396",
          },
          "& .MuiToolbar-gutters, .MuiTablePagination-selectIcon, .MuiSvgIcon-fontSizeMedium":
            {
              color: "#fff",
            },
          "& .MuiDataGrid-topContainer .MuiSvgIcon-fontSizeMedium": {
            color: "#3e4396",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `#fff !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection={true}
          rows={foods?.getRestourantAllFoods.data}
          columns={columns}
          sx={{
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#3e4396!important",
            },
          }}
        />
      </Box>
      )}
    </div>
  );
}

export default FoodsData;
