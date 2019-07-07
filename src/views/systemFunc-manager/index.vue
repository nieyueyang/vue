<script type="text/javascript" src="./index.js"></script>

<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="query">
				<el-form-item>
					<el-input v-model="query.funcCode" size="small" placeholder="功能编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="query.funcName" size="small" placeholder="功能名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="query.systemCode" size="small" width="50" placeholder="系统编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getAppSystemFunc">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="clear">清除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger" @click="batchDelete" size="small" :disabled="this.sels.length===0">批量删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="appSystemFunc" border highlight-current-row v-loading="listLoading" 
			@selection-change="selsChange" @current-change="CurrentRowChange" 
			row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
			style="width: 100%;" height="390">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column type="index" width="55"></el-table-column>
			<el-table-column prop="id" label="id" v-if="false"  width="80" ></el-table-column>
			<el-table-column prop="funcCode" label="功能编码" width="100" ></el-table-column>
			<el-table-column prop="funcName" label="功能名称" width="100" ></el-table-column>
			<el-table-column prop="systemCode" label="所属系统编码" width="150"></el-table-column>
			<el-table-column prop="systemName" label="所属系统" width="150"></el-table-column>
			<el-table-column prop="type" label="权限类型" width="150" :formatter="formatType"></el-table-column>
			<el-table-column prop="url" label="访问url" width="100" ></el-table-column>
			<el-table-column prop="status" label="是否启用" width="100" :formatter="formatStatus"></el-table-column>
			<el-table-column prop="openType" label="打开方式" width="100" :formatter="formatopenType"></el-table-column>
			<el-table-column prop="sort" label="排序" width="100"></el-table-column>
			<el-table-column prop="createAccount"  label="创建人编码" v-if="false"></el-table-column>
			<el-table-column prop="createName" label="创建人" width="120"></el-table-column>
			<el-table-column prop="createDate" label="创建时间" :formatter="dateFormat"  width="120"></el-table-column>
			<el-table-column label="操作" fixed="right" width="200">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination background
			@size-change="handleSizeChange" 
			@current-change="handleCurrentChange"  
			layout="prev, pager, next,jumper,sizes,total,slot"
			:current-page="pageNum"
			:page-sizes="[10,20,50,100]"
			:page-size="pageSize"
			:total= "total" 
			style="float:right;">
    	</el-pagination>

				<!--新增/编辑界面-->
		<el-dialog title="新增" v-model="openFormVisible" :close-on-click-modal="false">
			<el-form :model="openForm" label-width="80px" :rules="openFormRules" ref="openForm" >
				<el-input v-model="openForm.id" v-if="false"  size="small"></el-input>
				<el-row >
					<el-col :span="10" >
						<el-form-item label="功能编码" prop="funcCode">
							<el-input v-model="openForm.funcCode" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10" >
						<el-form-item label="功能名称" prop="funcName">
							<el-input v-model="openForm.funcName" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10">
						<el-form-item label="系统编码" prop="systemCode">
							<el-select v-model="openForm.systemCode" size="small" filterable placeholder="请选择">
								<el-option
									v-for="item in appSystem"
									:key="item.systemCode"
									:label="item.systemName"
									:value="item.systemCode">
									<span style="float: left">{{ item.systemName }}</span>
									<span style="float: right; color: #8492a6; font-size: 14px">{{ item.systemCode }}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="URL" prop="url">
							<el-input v-model="openForm.url" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="打开方式" prop="openType">
							<el-select v-model="openForm.openType" size="small" placeholder="请选择...">
								<el-option label="内嵌" value="0"></el-option>
								<el-option label="弹出" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10" >
						<el-form-item label="权限类型" prop="type">
							<el-select v-model="openForm.type" size="small" placeholder="请选择...">
								<el-option label="菜单" value="0"></el-option>
								<el-option label="功能" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					
				</el-row>

				<el-row >
					<el-col :span="10">
						<el-form-item label="排序" prop="sort">
							<!-- <el-input v-model="openForm.sort" size="small"></el-input> -->
							 <el-input-number v-model="openForm.sort" size="small"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="10" >
						<el-form-item label="是否启用">
							<el-select v-model="openForm.status" size="small" placeholder="请选择...">
								<el-option label="启用" value="0"></el-option>
								<el-option label="禁用" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="openFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="save" :loading="openLoading">提交</el-button>
			</div>
		</el-dialog>

		

	</section>
</template>



<style scoped> 	
	@import './index.less'; 
</style>
