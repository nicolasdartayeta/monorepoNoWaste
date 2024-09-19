import {
    Role, 
    role,
    NewRole,
    Permission,
    permission,
    NewPermission,
    userRole,
    NewUserRole,
    user,
    NewUser,
    UserRole,
    rolePermission,
    NewRolePermission,

  } from "@server/db/schema";
import { eq,and } from "drizzle-orm";
import { db } from "@server/db/db";

export async function createRole(role_name: string): Promise<Role> {
    return (await db.insert(role).values({name: role_name}).returning())[0]
}

export async function deleteRole(role_id: string): Promise<boolean>{
    const result = await db
        .delete(role)
        .where(eq(role.id, role_id))
        .returning();

    if (result) return true;
    return false;
}

export async function createPermission(newPermission: NewPermission): Promise<Permission>{
    return (await db.insert(permission)
    .values(newPermission).returning())[0]
}

export async function deletePermission(id_permission: string): Promise<boolean>{
    const result = await db
        .delete(permission)
        .where(eq(permission.id, id_permission))
        .returning();

    if (result) return true;
    return false;
}

export async function addUserRole(newUserRole: NewUserRole): Promise<UserRole>{
    return (await db.insert(userRole)
    .values(newUserRole).returning())[0]
}

export async function removeUserRole(deleteUserRole: NewUserRole): Promise<boolean>{
    const result = await db
        .delete(userRole)
        .where(
            and(
                eq(userRole.user_id, deleteUserRole.user_id),
                eq(userRole.role_id, deleteUserRole.role_id)
            ))
        .returning();

    if (result) return true;
    return false;
}

export async function addRolePermission(newRolePermission: NewRolePermission): Promise<NewRolePermission>{
    return (await db.insert(rolePermission)
    .values(newRolePermission).returning())[0]}

export async function removeRolePermission(oldRolePermission: NewRolePermission): Promise<boolean>{
    const result = await db
        .delete(rolePermission)
        .where(
            and(
                eq(rolePermission.role_id, oldRolePermission.role_id),
                eq(rolePermission.permission_id, oldRolePermission.permission_id))
            )
        .returning();

    if (result) return true;
    return false;
}

export async function checkPermission(user_id: string, table_name: string, action: string): Promise<boolean>{
    const result = (await db.select().from(userRole).where(eq(userRole.user_id, user_id)));

    for (const index in result){
        // aca tengo que iterar por los roles y fijarme si tienen el permiso para la tabla, tengo que hacer un join
        let join = await db.select().from(rolePermission)
        .innerJoin(permission, eq(rolePermission.permission_id, permission.id))
        .where(eq(rolePermission.role_id, result[index].role_id))
        
        result[index].role_id 
    }
    return true;
}
