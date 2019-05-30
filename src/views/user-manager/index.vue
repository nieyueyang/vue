<script type="text/javascript" src="./index.js"></script>

<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable></el-table-column>
			<el-table-column prop="account" label="用户账号" width="120" sortable></el-table-column>
			<el-table-column prop="name" label="名称" width="150" sortable></el-table-column>
			<el-table-column prop="salt" label="盐" width="120" sortable></el-table-column>
			<el-table-column prop="parentId" label="上级ID" width="150" sortable></el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable></el-table-column>
			<el-table-column prop="phone" label="电话" min-width="100" sortable></el-table-column>
			<el-table-column prop="email" label="电子邮箱" min-width="100" sortable></el-table-column>
			<el-table-column prop="companyId" label="公司" min-width="100" sortable></el-table-column>
			<el-table-column prop="source" label="来源" min-width="180" sortable></el-table-column>
			<el-table-column prop="createAccount" label="创建人编码" min-width="180" sortable></el-table-column>
			<el-table-column prop="createName" label="创建人" min-width="180" sortable></el-table-column>
			<el-table-column prop="createDate" label="创建时间" min-width="180" sortable></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

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
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
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