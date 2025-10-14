import { auth } from "@/auth";
//COMPOMENTS
import { UsersTable } from "@/components/table/UsersTable";
import { IUserResponse, IUsersData } from "@/lib/types/User";

const getUsersData = async () => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        message: "Session not found",
      };
    }
    const token = session?.token;
    if (!token) {
      return {
        success: false,
        message: "Token not found",
      };
    }
    const res = await fetch(`${process.env.FRONTEND_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 0,
        tags: ["users"],
      },
    });
    if (!res.ok) {
      return {
        success: false,
        message: "Failed to fetch users data",
      };
    }
    const usersData: IUserResponse<IUsersData[]> = await res.json();
    if (!usersData.success) {
      return {
        success: false,
        message: usersData.message || "Failed to fetch users data",
      };
    }
    return {
      success: true,
      data: usersData.data,
    };
  } catch (error) {
    console.error("Error fetching users data:", error);
    return {
      success: false,
      message: "Error fetching users data",
    };
  }
};

const AdminPage = async () => {
  const session = await auth();
  if (!session) {
    return <div>Unauthorized</div>;
  }
  const token = session?.token;
  const usersData = await getUsersData();
  if (!usersData.success) {
    return <div>No users data available</div>;
  }

  return (
    <>
      <div className=" mx-auto py-10">
        <h1 className="text-lg font-bold">Profile</h1>
        <UsersTable usersData={usersData.data!} token={token} />
      </div>
    </>
  );
};

export default AdminPage;
