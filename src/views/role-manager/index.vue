<script type="text/javascript" src="./index.js"></script>

<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.roleCode" placeholder="角色编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.roleName" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRole">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="role" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column key="1" prop="id" label="id" v-if="false"  width="80" sortable></el-table-column>
			<el-table-column key="2" prop="roleCode" label="角色编码" width="120" sortable></el-table-column>
			<el-table-column key="3" prop="roleName" label="角色名称" width="150" sortable></el-table-column>
			<el-table-column key="4" prop="roleType" label="角色类别" width="120" sortable></el-table-column>
			<el-table-column key="5" prop="isactive" label="是否启用" width="150" sortable></el-table-column>
			<el-table-column key="6" prop="createAccount" label="创建人编码" min-width="180" sortable></el-table-column>
			<el-table-column key="7" prop="createName" label="创建人" min-width="180" sortable></el-table-column>
			<el-table-column key="8" prop="createDate" label="创建时间" :formatter="dateFormat"  min-width="180" sortable></el-table-column>
			<el-table-column key="9" label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination background
			@size-change="handleSizeChange" 
			@current-change="handleCurrentChange"  
			layout="prev, pager, next,jumper,sizes,total"
			:current-page="pageNum"
			:page-sizes="[10,20,50,100]"
			:page-size="pageSize"
			:total= "total" 
			style="float:right;">
    	</el-pagination>


		<!--工具条-->

			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<!-- <el-pagination layout="prev, pager, next"
						   @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination> -->


		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="菜单编码" prop="menuCode">
					<el-input v-model="editForm.menuCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="菜单名称" prop="menuName">
					<el-input v-model="editForm.menuName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="菜单类型" prop="menuType">
					<el-radio-group v-model="editForm.menuType">
						<el-radio class="radio" :label="0">菜单0</el-radio>
						<el-radio class="radio" :label="1">菜单1</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="URL">
					<el-input v-model="editForm.path"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="editForm.sort" :min="0" :max="500" ></el-input-number>
				</el-form-item>
				<el-form-item label="图标">
					<el-input v-model="editForm.icon" ></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.remark"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色编码" prop="roleCode">
					<el-input v-model="addForm.roleCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addForm.roleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色类型">
					<el-select v-model="addForm.roleType" placeholder="请选择角色类型">
						<el-option label="业务类" value="0"></el-option>
						<el-option label="管理类" value="1"></el-option>
						<el-option label="审计类" value="2"></el-option>
					</el-select>
				</el-form-item>
					<el-form-item label="是否启用">
					<el-radio-group v-model="addForm.isactive">
						<el-radio class="radio" :label="0">启用</el-radio>
						<el-radio class="radio" :label="1">停用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>


<style scoped>

</style>